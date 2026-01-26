import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsightEntity } from './entities/insight.entity';
import { InsightRepository } from './infrastructure/insight.repository';
import { InsightsService } from './insights.service';
import { InsightGenerationService } from './application/insight-generation.service';
import { InsightsController } from './presentation/insights.controller';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [TypeOrmModule.forFeature([InsightEntity]), StatsModule],
  controllers: [InsightsController],
  providers: [InsightsService, InsightRepository, InsightGenerationService],
  exports: [InsightsService, InsightRepository, InsightGenerationService],
})
export class InsightsModule {}
