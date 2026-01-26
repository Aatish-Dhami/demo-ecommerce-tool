import { Controller, Get, Query } from '@nestjs/common';
import {
  Insight,
  InsightsQueryDto,
  PaginatedResponseDto,
} from '@flowtel/shared';
import { InsightRepository } from '../infrastructure/insight.repository';

@Controller('api/insights')
export class InsightsController {
  constructor(private readonly insightRepository: InsightRepository) {}

  @Get()
  async findAll(
    @Query() query: InsightsQueryDto,
  ): Promise<PaginatedResponseDto<Insight>> {
    return this.insightRepository.findAll({
      type: query.type,
      limit: query.limit,
      offset: query.offset,
    });
  }
}
