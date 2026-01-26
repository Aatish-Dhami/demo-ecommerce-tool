import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ChatResponseDto, ChatSource, Stats } from '@flowtel/shared';
import { StatsService } from '../stats/stats.service';
import { EventsService } from '../events/events.service';
import { InsightsService } from '../insights/insights.service';
import { LlmService } from '../llm/llm.service';
import { Event } from '../events/entities/event.entity';
import { InsightEntity } from '../insights/entities/insight.entity';

@Injectable()
export class ChatService {
  constructor(
    private readonly statsService: StatsService,
    private readonly eventsService: EventsService,
    private readonly insightsService: InsightsService,
    private readonly llmService: LlmService,
  ) {}

  async askQuestion(
    question: string,
    shopId: string,
    conversationId?: string,
  ): Promise<ChatResponseDto> {
    const convId = conversationId || randomUUID();

    const [stats, eventsResult, insights] = await Promise.all([
      this.statsService.getStats({ shopId }),
      this.eventsService.findAll({ shopId, limit: 50 }),
      this.insightsService.findRecent(5),
    ]);

    const recentEvents = eventsResult.data;

    const contextPrompt = this.buildContextPrompt(stats, recentEvents, insights);

    const answer = await this.llmService.chat(contextPrompt, question);

    const sources = this.extractSources(stats, recentEvents, insights);

    return {
      answer,
      conversationId: convId,
      sources,
    };
  }

  private buildContextPrompt(
    stats: Stats,
    recentEvents: Event[],
    insights: InsightEntity[],
  ): string {
    const eventSummary = this.summarizeEvents(recentEvents);

    return `You are an analytics assistant for an e-commerce platform. Answer questions based on the following data.

## Current Statistics
- Total Events: ${stats.totalEvents}
- Page Views: ${stats.totalPageViews}
- Product Views: ${stats.totalProductViews}
- Add to Carts: ${stats.totalAddToCarts}
- Purchases: ${stats.totalPurchases}
- Total Revenue: $${stats.totalRevenue.toFixed(2)}
- Conversion Rate: ${stats.conversionRate}%

## Top Products
${stats.topProducts.map((p) => `- ${p.name}: ${p.count} views`).join('\n')}

## Recent Activity Summary
${eventSummary}

## Recent Insights
${insights.length > 0 ? insights.map((i) => `- [${i.type}] ${i.title}: ${i.content}`).join('\n') : 'No insights available yet.'}

Answer the user's question concisely based on this data. If the data doesn't contain relevant information, say so.`;
  }

  private summarizeEvents(events: Event[]): string {
    if (events.length === 0) {
      return 'No recent events.';
    }

    const byType = events.reduce(
      (acc, e) => {
        acc[e.eventType] = (acc[e.eventType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(byType)
      .map(([type, count]) => `- ${type}: ${count} events`)
      .join('\n');
  }

  private extractSources(
    stats: Stats,
    recentEvents: Event[],
    insights: InsightEntity[],
  ): ChatSource[] {
    const sources: ChatSource[] = [];

    sources.push({
      type: 'stats',
      reference: 'Aggregated shop statistics',
    });

    if (recentEvents.length > 0) {
      sources.push({
        type: 'events',
        reference: `Last ${recentEvents.length} events`,
      });
    }

    if (insights.length > 0) {
      sources.push({
        type: 'insights',
        reference: `${insights.length} recent insights`,
      });
    }

    return sources;
  }
}
