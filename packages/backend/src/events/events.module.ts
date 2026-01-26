import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventQueryService } from './application/event-query.service';
import { EventRepository } from './infrastructure/event.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventsController],
  providers: [EventsService, EventQueryService, EventRepository],
  exports: [EventsService, EventQueryService, EventRepository],
})
export class EventsModule {}
