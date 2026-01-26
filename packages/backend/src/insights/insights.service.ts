import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insight } from '@flowtel/shared';
import { InsightEntity } from './entities/insight.entity';

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(InsightEntity)
    private readonly insightRepository: Repository<InsightEntity>,
  ) {}

  async create(insight: Insight): Promise<InsightEntity> {
    const entity = this.insightRepository.create(insight);
    return this.insightRepository.save(entity);
  }

  async findAll(): Promise<InsightEntity[]> {
    return this.insightRepository.find();
  }

  async findRecent(limit: number): Promise<InsightEntity[]> {
    return this.insightRepository.find({
      order: { generatedAt: 'DESC' },
      take: limit,
    });
  }
}
