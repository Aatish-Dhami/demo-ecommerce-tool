import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsightEntity } from './entities/insight.entity';
import { InsightRepository } from './infrastructure/insight.repository';
import { InsightsService } from './insights.service';

@Module({
  imports: [TypeOrmModule.forFeature([InsightEntity])],
  providers: [InsightsService, InsightRepository],
  exports: [InsightsService, InsightRepository],
})
export class InsightsModule {}
