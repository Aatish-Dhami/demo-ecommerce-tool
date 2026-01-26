import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  CreateEventDto,
  EventsQueryDto,
  PaginatedResponseDto,
} from '@flowtel/shared';
import { Event } from './entities/event.entity';
import { EventRepository } from './infrastructure/event.repository';

@Injectable()
export class EventsService {
  constructor(private readonly eventRepository: EventRepository) {}

  async create(dto: CreateEventDto): Promise<Event> {
    const event = {
      id: randomUUID(),
      ...dto,
      timestamp: dto.timestamp || new Date().toISOString(),
    } as Event;
    return this.eventRepository.save(event);
  }

  async createBatch(dtos: CreateEventDto[]): Promise<Event[]> {
    const events = dtos.map(
      (dto) =>
        ({
          id: randomUUID(),
          ...dto,
          timestamp: dto.timestamp || new Date().toISOString(),
        }) as Event,
    );
    return this.eventRepository.saveBatch(events);
  }

  async findAll(filters: EventsQueryDto): Promise<PaginatedResponseDto<Event>> {
    return this.eventRepository.findAll(filters);
  }

  async findByShopId(shopId: string): Promise<Event[]> {
    return this.eventRepository.findByShopId(shopId);
  }
}
