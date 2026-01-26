import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsightEntity } from './entities/insight.entity';
import { InsightsService } from './insights.service';
import { InsightGenerationService } from './application/insight-generation.service';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InsightEntity]),
    StatsModule,
  ],
  providers: [InsightsService, InsightGenerationService],
  exports: [InsightsService, InsightGenerationService],
})
export class InsightsModule {}
