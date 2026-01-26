import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsightEntity } from './entities/insight.entity';
import { InsightsService } from './insights.service';

@Module({
  imports: [TypeOrmModule.forFeature([InsightEntity])],
  providers: [InsightsService],
  exports: [InsightsService],
})
export class InsightsModule {}
