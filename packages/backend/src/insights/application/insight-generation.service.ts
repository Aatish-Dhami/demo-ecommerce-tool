import { Injectable, Logger } from '@nestjs/common';
import { Insight } from '@flowtel/shared';
import { StatsService } from '../../stats/stats.service';
import { LlmService } from '../../llm/llm.service';
import { InsightsService } from '../insights.service';

@Injectable()
export class InsightGenerationService {
  private readonly logger = new Logger(InsightGenerationService.name);

  constructor(
    private readonly statsService: StatsService,
    private readonly llmService: LlmService,
    private readonly insightsService: InsightsService,
  ) {}

  async generateInsights(shopId: string): Promise<Insight[]> {
    this.logger.log(`Generating insights for shop: ${shopId}`);

    // 1. Fetch aggregated stats (AC: fetches recent events)
    const stats = await this.statsService.getStats(shopId);

    // 2. Generate insights via LLM (AC: build prompt + parse response)
    const insights = await this.llmService.generateInsight(stats);

    // 3. Save each insight to database (AC: save to database)
    const savedInsights: Insight[] = [];
    for (const insight of insights) {
      const saved = await this.insightsService.create(insight);
      savedInsights.push(saved);
    }

    this.logger.log(`Generated and saved ${savedInsights.length} insights`);
    return savedInsights;
  }
}
