import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsightType, PaginatedResponseDto } from '@flowtel/shared';
import { InsightEntity } from '../entities/insight.entity';

export interface InsightsQueryOptions {
  type?: InsightType;
  page?: number;
  limit?: number;
  offset?: number;
}

@Injectable()
export class InsightRepository {
  constructor(
    @InjectRepository(InsightEntity)
    private readonly repository: Repository<InsightEntity>,
  ) {}

  async save(insight: InsightEntity): Promise<InsightEntity> {
    return this.repository.save(insight);
  }

  async findAll(
    options?: InsightsQueryOptions,
  ): Promise<PaginatedResponseDto<InsightEntity>> {
    const limit = options?.limit || 20;
    const skip =
      options?.offset ?? ((options?.page || 1) - 1) * limit;
    const page = options?.page || Math.floor(skip / limit) + 1;

    const queryBuilder = this.repository.createQueryBuilder('insight');

    if (options?.type) {
      queryBuilder.andWhere('insight.type = :type', { type: options.type });
    }

    queryBuilder.orderBy('insight.generatedAt', 'DESC');

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

  async findLatest(limit: number = 10): Promise<InsightEntity[]> {
    return this.repository.find({
      order: { generatedAt: 'DESC' },
      take: limit,
    });
  }

  async findByType(type: InsightType): Promise<InsightEntity[]> {
    return this.repository.find({
      where: { type },
      order: { generatedAt: 'DESC' },
    });
  }
}
