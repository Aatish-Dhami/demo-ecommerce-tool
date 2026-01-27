import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EventsQueryDto,
  PaginatedResponseDto,
  TrackingEvent,
} from '@flowtel/shared';
import { Event } from '../entities/event.entity';

@Injectable()
export class EventQueryService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  private toDto(event: Event): TrackingEvent {
    return {
      id: event.id,
      shopId: event.shopId,
      sessionId: event.sessionId,
      eventType: event.eventType,
      eventName: event.eventName,
      properties: event.properties,
      timestamp: event.timestamp,
      url: event.url,
      userAgent: event.userAgent,
    };
  }

  async getEvents(
    filters: EventsQueryDto,
  ): Promise<PaginatedResponseDto<TrackingEvent>> {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.eventRepository.createQueryBuilder('event');

    if (filters.shopId) {
      queryBuilder.andWhere('event.shopId = :shopId', {
        shopId: filters.shopId,
      });
    }

    if (filters.eventType) {
      queryBuilder.andWhere('event.eventType = :eventType', {
        eventType: filters.eventType,
      });
    }

    if (filters.sessionId) {
      queryBuilder.andWhere('event.sessionId = :sessionId', {
        sessionId: filters.sessionId,
      });
    }

    if (filters.startDate) {
      queryBuilder.andWhere('event.timestamp >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('event.timestamp <= :endDate', {
        endDate: filters.endDate,
      });
    }

    queryBuilder.orderBy('event.timestamp', 'DESC');

    const [entities, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const data = entities.map((entity) => this.toDto(entity));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getEventById(id: string): Promise<TrackingEvent | null> {
    const event = await this.eventRepository.findOne({ where: { id } });

    if (!event) {
      return null;
    }

    return this.toDto(event);
  }
}
