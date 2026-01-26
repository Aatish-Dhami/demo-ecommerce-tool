import { Controller, Get, Query } from '@nestjs/common';
import { Stats, StatsQueryDto } from '@flowtel/shared';
import { StatsService } from './stats.service';

@Controller('api/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getStats(@Query() query: StatsQueryDto): Promise<Stats> {
    return this.statsService.getStats(query);
  }
}
