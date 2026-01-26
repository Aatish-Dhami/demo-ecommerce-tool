import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { Stats, Insight, InsightType } from '@flowtel/shared';
import { randomUUID } from 'crypto';

type LlmProvider = 'openai' | 'anthropic';

interface LlmConfig {
  provider: LlmProvider;
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

interface GeneratedInsight {
  type: InsightType;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
}

export class LlmServiceError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'LlmServiceError';
  }
}

const DEFAULT_MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;

@Injectable()
export class LlmService implements OnModuleInit {
  private readonly logger = new Logger(LlmService.name);
  private config!: LlmConfig;
  private openaiClient?: OpenAI;
  private anthropicClient?: Anthropic;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    this.config = this.loadConfig();
    this.initializeClient();
    this.logger.log(
      `LLM Service initialized with ${this.config.provider} provider (model: ${this.config.model})`,
    );
  }

  private loadConfig(): LlmConfig {
    const openaiKey = this.configService.get<string>('OPENAI_API_KEY');
    const anthropicKey = this.configService.get<string>('ANTHROPIC_API_KEY');

    if (!openaiKey && !anthropicKey) {
      throw new LlmServiceError(
        'Either OPENAI_API_KEY or ANTHROPIC_API_KEY must be set',
      );
    }

    const provider: LlmProvider = openaiKey ? 'openai' : 'anthropic';
    const apiKey = (openaiKey || anthropicKey) as string;

    return {
      provider,
      apiKey,
      model:
        provider === 'openai'
          ? this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o-mini'
          : this.configService.get<string>('ANTHROPIC_MODEL') ||
            'claude-3-haiku-20240307',
      maxTokens: parseInt(
        this.configService.get<string>('LLM_MAX_TOKENS') || '1024',
        10,
      ),
      temperature: parseFloat(
        this.configService.get<string>('LLM_TEMPERATURE') || '0.7',
      ),
    };
  }

  private initializeClient(): void {
    if (this.config.provider === 'openai') {
      this.openaiClient = new OpenAI({ apiKey: this.config.apiKey });
    } else {
      this.anthropicClient = new Anthropic({ apiKey: this.config.apiKey });
    }
  }

  private isRateLimitError(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (message.includes('rate_limit') || message.includes('rate limit')) {
        return true;
      }
    }
    // OpenAI SDK throws APIError with status 429
    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      (error as { status: number }).status === 429
    ) {
      return true;
    }
    // Anthropic SDK has error.error.type === 'rate_limit_error'
    if (
      typeof error === 'object' &&
      error !== null &&
      'error' in error &&
      typeof (error as { error: unknown }).error === 'object' &&
      (error as { error: { type?: string } }).error?.type === 'rate_limit_error'
    ) {
      return true;
    }
    return false;
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = DEFAULT_MAX_RETRIES,
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (!this.isRateLimitError(error) || attempt === maxRetries) {
          throw error;
        }

        const delayMs = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt);
        this.logger.warn(
          `Rate limit hit, retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries})`,
        );
        await this.sleep(delayMs);
      }
    }

    throw lastError;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async generateCompletion(prompt: string): Promise<string> {
    this.logger.log('Generating completion...');

    try {
      const response = await this.withRetry(() =>
        this.config.provider === 'openai'
          ? this.completionWithOpenAI(prompt)
          : this.completionWithAnthropic(prompt),
      );

      return response;
    } catch (error) {
      this.logger.error('Failed to generate completion', error);
      throw new LlmServiceError('Failed to generate completion', error);
    }
  }

  private async completionWithOpenAI(prompt: string): Promise<string> {
    if (!this.openaiClient) {
      throw new LlmServiceError('OpenAI client not initialized');
    }

    const response = await this.openaiClient.chat.completions.create({
      model: this.config.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
    });

    return response.choices[0]?.message?.content ?? '';
  }

  private async completionWithAnthropic(prompt: string): Promise<string> {
    if (!this.anthropicClient) {
      throw new LlmServiceError('Anthropic client not initialized');
    }

    const response = await this.anthropicClient.messages.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new LlmServiceError('Empty response from Anthropic');
    }

    return textBlock.text;
  }

  async generateInsight(stats: Stats): Promise<Insight[]> {
    this.logger.log('Generating insights from stats...');

    try {
      const prompt = this.buildInsightPrompt(stats);
      const generatedInsights = await this.withRetry(() =>
        this.config.provider === 'openai'
          ? this.generateWithOpenAI(prompt)
          : this.generateWithAnthropic(prompt),
      );

      const insights = generatedInsights.map((generated) =>
        this.toInsight(generated),
      );

      this.logger.log(`Generated ${insights.length} insights`);
      return insights;
    } catch (error) {
      this.logger.error('Failed to generate insights', error);
      throw new LlmServiceError('Failed to generate insights', error);
    }
  }

  private buildInsightPrompt(stats: Stats): string {
    return `You are an e-commerce analytics expert. Analyze the following store statistics and generate insights.

## Store Statistics
- Total Events: ${stats.totalEvents}
- Page Views: ${stats.totalPageViews}
- Product Views: ${stats.totalProductViews}
- Add to Carts: ${stats.totalAddToCarts}
- Purchases: ${stats.totalPurchases}
- Total Revenue: $${stats.totalRevenue.toFixed(2)}
- Conversion Rate: ${stats.conversionRate.toFixed(2)}%
- Top Products: ${JSON.stringify(stats.topProducts, null, 2)}

## Task
Generate 1-3 insights in the following categories:
1. **summary** - Overall performance summary
2. **trend** - Notable patterns or trends
3. **anomaly** - Unusual metrics that need attention

## Response Format
Respond with a JSON array of insights:
[
  {
    "type": "summary" | "trend" | "anomaly",
    "title": "Brief insight title (max 60 chars)",
    "content": "Detailed explanation with actionable recommendations (2-4 sentences)",
    "metadata": { "metric": "value", ... }
  }
]

Focus on actionable insights that help improve business outcomes. Respond only with the JSON array.`;
  }

  private async generateWithOpenAI(prompt: string): Promise<GeneratedInsight[]> {
    if (!this.openaiClient) {
      throw new LlmServiceError('OpenAI client not initialized');
    }

    const response = await this.openaiClient.chat.completions.create({
      model: this.config.model,
      messages: [
        { role: 'system', content: 'You are an e-commerce analytics expert.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new LlmServiceError('Empty response from OpenAI');
    }

    const parsed = JSON.parse(content);
    const insights = Array.isArray(parsed) ? parsed : parsed.insights || [];

    return this.validateInsights(insights);
  }

  private async generateWithAnthropic(
    prompt: string,
  ): Promise<GeneratedInsight[]> {
    if (!this.anthropicClient) {
      throw new LlmServiceError('Anthropic client not initialized');
    }

    const response = await this.anthropicClient.messages.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new LlmServiceError('Empty response from Anthropic');
    }

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = textBlock.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new LlmServiceError('Could not parse JSON from Anthropic response');
    }

    const insights = JSON.parse(jsonMatch[0]);
    return this.validateInsights(insights);
  }

  private validateInsights(insights: unknown[]): GeneratedInsight[] {
    return insights
      .filter((insight): insight is GeneratedInsight => {
        return (
          typeof insight === 'object' &&
          insight !== null &&
          'type' in insight &&
          'title' in insight &&
          'content' in insight &&
          ['summary', 'trend', 'anomaly'].includes(
            (insight as { type: string }).type,
          )
        );
      })
      .map((insight) => ({
        type: insight.type,
        title: String(insight.title).slice(0, 60),
        content: String(insight.content),
        metadata: (insight.metadata as Record<string, unknown>) || {},
      }));
  }

  private toInsight(generated: GeneratedInsight): Insight {
    return {
      id: `ins-${randomUUID()}`,
      generatedAt: new Date().toISOString(),
      type: generated.type,
      title: generated.title,
      content: generated.content,
      metadata: generated.metadata,
    };
  }

  async chat(systemPrompt: string, userMessage: string): Promise<string> {
    this.logger.log('Processing chat request...');

    try {
      const response = await this.withRetry(() =>
        this.config.provider === 'openai'
          ? this.chatWithOpenAI(systemPrompt, userMessage)
          : this.chatWithAnthropic(systemPrompt, userMessage),
      );

      return response;
    } catch (error) {
      this.logger.error('Failed to process chat request', error);
      throw new LlmServiceError('Failed to process chat request', error);
    }
  }

  private async chatWithOpenAI(
    systemPrompt: string,
    userMessage: string,
  ): Promise<string> {
    if (!this.openaiClient) {
      throw new LlmServiceError('OpenAI client not initialized');
    }

    const response = await this.openaiClient.chat.completions.create({
      model: this.config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: this.config.maxTokens,
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content ?? '';
  }

  private async chatWithAnthropic(
    systemPrompt: string,
    userMessage: string,
  ): Promise<string> {
    if (!this.anthropicClient) {
      throw new LlmServiceError('Anthropic client not initialized');
    }

    const response = await this.anthropicClient.messages.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new LlmServiceError('Empty response from Anthropic');
    }

    return textBlock.text;
  }
}
