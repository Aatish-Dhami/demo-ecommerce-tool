import { Controller, Get, Query } from '@nestjs/common';
import { Stats, StatsQueryDto } from '@flowtel/shared';
import { StatsAggregationService } from './stats-aggregation.service';

@Controller('api/stats')
export class StatsController {
  constructor(private readonly statsAggregationService: StatsAggregationService) {}

  @Get()
  async getStats(@Query() query: StatsQueryDto): Promise<Stats> {
    return this.statsAggregationService.getStats(query);
  }
}
