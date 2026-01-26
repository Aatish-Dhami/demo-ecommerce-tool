import { Injectable, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'crypto';
import { CreateEventDto } from '@flowtel/shared';
import { Event } from '../entities/event.entity';
import { EventRepository } from '../infrastructure/event.repository';
import {
  EventIngestedEvent,
  BatchEventsIngestedEvent,
} from './events/event-ingested.event';

@Injectable()
export class EventIngestionService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async ingestEvent(dto: CreateEventDto): Promise<Event> {
    this.validateEvent(dto);

    const event = {
      id: randomUUID(),
      ...dto,
      timestamp: dto.timestamp || new Date().toISOString(),
    } as Event;

    const savedEvent = await this.eventRepository.save(event);

    this.eventEmitter.emit(
      'event.ingested',
      new EventIngestedEvent(
        savedEvent.id,
        savedEvent.shopId,
        savedEvent.eventType,
        savedEvent.timestamp,
      ),
    );

    return savedEvent;
  }

  async ingestBatch(dtos: CreateEventDto[]): Promise<Event[]> {
    if (!Array.isArray(dtos) || dtos.length === 0) {
      throw new BadRequestException('Batch must contain at least one event');
    }

    dtos.forEach((dto, index) => {
      try {
        this.validateEvent(dto);
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw new BadRequestException(
            `Event at index ${index}: ${error.message}`,
          );
        }
        throw error;
      }
    });

    const timestamp = new Date().toISOString();
    const events = dtos.map(
      (dto) =>
        ({
          id: randomUUID(),
          ...dto,
          timestamp: dto.timestamp || timestamp,
        }) as Event,
    );

    const savedEvents = await this.eventRepository.saveBatch(events);

    const shopId = savedEvents[0]?.shopId || '';
    this.eventEmitter.emit(
      'events.batch.ingested',
      new BatchEventsIngestedEvent(
        savedEvents.map((e) => e.id),
        shopId,
        savedEvents.length,
        timestamp,
      ),
    );

    return savedEvents;
  }

  private validateEvent(dto: CreateEventDto): void {
    if (!dto.shopId) {
      throw new BadRequestException('shopId is required');
    }
    if (!dto.sessionId) {
      throw new BadRequestException('sessionId is required');
    }
    if (!dto.eventType) {
      throw new BadRequestException('eventType is required');
    }
    if (!dto.eventName) {
      throw new BadRequestException('eventName is required');
    }
  }
}
