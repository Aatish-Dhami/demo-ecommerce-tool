import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import {
  CreateEventDto,
  EventsQueryDto,
  PaginatedResponseDto,
} from '@flowtel/shared';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(dto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create({
      id: randomUUID(),
      ...dto,
      timestamp: dto.timestamp || new Date().toISOString(),
    });
    return this.eventRepository.save(event);
  }

  async createBatch(dtos: CreateEventDto[]): Promise<Event[]> {
    const events = dtos.map((dto) =>
      this.eventRepository.create({
        id: randomUUID(),
        ...dto,
        timestamp: dto.timestamp || new Date().toISOString(),
      }),
    );
    return this.eventRepository.save(events);
  }

  async findAll(filters: EventsQueryDto): Promise<PaginatedResponseDto<Event>> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.eventRepository.createQueryBuilder('event');

    if (filters.shopId) {
      queryBuilder.andWhere('event.shopId = :shopId', {
        shopId: filters.shopId,
      });
    }

    if (filters.sessionId) {
      queryBuilder.andWhere('event.sessionId = :sessionId', {
        sessionId: filters.sessionId,
      });
    }

    if (filters.eventType) {
      queryBuilder.andWhere('event.eventType = :eventType', {
        eventType: filters.eventType,
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

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByShopId(shopId: string): Promise<Event[]> {
    return this.eventRepository.find({
      where: { shopId },
      order: { timestamp: 'DESC' },
    });
  }
}
