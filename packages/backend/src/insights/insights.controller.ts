import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Insight, InsightGenerateRequestDto } from '@flowtel/shared';
import { InsightGenerationService } from './application/insight-generation.service';
import { LlmServiceError } from '../llm/llm.service';

@Controller('api/insights')
export class InsightsController {
  private readonly logger = new Logger(InsightsController.name);

  constructor(
    private readonly insightGenerationService: InsightGenerationService,
  ) {}

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  async generate(@Body() dto: InsightGenerateRequestDto): Promise<Insight[]> {
    const shopId = dto.shopId || 'default';

    try {
      this.logger.log(`Generating insights for shop: ${shopId}`);
      const insights =
        await this.insightGenerationService.generateInsights(shopId);
      return insights;
    } catch (error) {
      if (error instanceof LlmServiceError) {
        const message = error.message.toLowerCase();
        if (
          message.includes('rate') ||
          message.includes('timeout') ||
          message.includes('unavailable')
        ) {
          this.logger.warn(`LLM service unavailable: ${error.message}`);
          throw new HttpException(
            { message: 'LLM service temporarily unavailable', error: error.message },
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }

        this.logger.error(`LLM service error: ${error.message}`);
        throw new HttpException(
          { message: 'Failed to generate insights', error: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.error('Unexpected error generating insights', error);
      throw new HttpException(
        { message: 'Failed to generate insights' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
