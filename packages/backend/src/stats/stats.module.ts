import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../events/entities/event.entity';
import { EventsModule } from '../events/events.module';
import { StatsController } from './stats.controller';
import { StatsAggregationService } from './stats-aggregation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), EventsModule],
  controllers: [StatsController],
  providers: [StatsAggregationService],
  exports: [StatsAggregationService],
})
export class StatsModule {}
