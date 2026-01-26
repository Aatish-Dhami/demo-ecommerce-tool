import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventsQueryDto, PaginatedResponseDto } from '@flowtel/shared';
import { Event } from '../entities/event.entity';

@Injectable()
export class EventRepository {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  async save(event: Event): Promise<Event> {
    return this.repository.save(event);
  }

  async saveBatch(events: Event[]): Promise<Event[]> {
    return this.repository.save(events);
  }

  async findAll(filters: EventsQueryDto): Promise<PaginatedResponseDto<Event>> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('event');

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
    return this.repository.find({
      where: { shopId },
      order: { timestamp: 'DESC' },
    });
  }
}
