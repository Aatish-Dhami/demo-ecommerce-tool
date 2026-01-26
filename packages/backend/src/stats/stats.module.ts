import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../events/entities/event.entity';
import { StatsService } from './stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
