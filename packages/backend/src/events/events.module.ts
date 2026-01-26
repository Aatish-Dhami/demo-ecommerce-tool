import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventRepository } from './infrastructure/event.repository';
import { EventIngestionService } from './application/event-ingestion.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventsController],
  providers: [EventsService, EventRepository, EventIngestionService],
  exports: [EventsService, EventRepository, EventIngestionService],
})
export class EventsModule {}
