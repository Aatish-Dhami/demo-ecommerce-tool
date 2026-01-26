import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Stats, StatsQueryDto, TopProduct, products } from '@flowtel/shared';
import { Event } from '../events/entities/event.entity';

interface EventCountResult {
  eventType: string;
  count: string;
}

interface RevenueResult {
  totalRevenue: string | null;
}

interface ProductCountResult {
  productId: string;
  count: string;
}

interface SessionCountResult {
  sessionCount: string;
}

@Injectable()
export class StatsService {
  private readonly productMap: Map<string, string>;

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {
    this.productMap = new Map(products.map((p) => [p.id, p.name]));
  }

  async getStats(query: StatsQueryDto = {}): Promise<Stats> {
    const [eventCounts, revenueResult, topProductsResult, conversionData] =
      await Promise.all([
        this.getEventCounts(query),
        this.getTotalRevenue(query),
        this.getTopProducts(query),
        this.getConversionData(query),
      ]);

    const countsMap = new Map<string, number>(
      eventCounts.map((r) => [r.eventType, Number(r.count)]),
    );

    const totalEvents = Array.from(countsMap.values()).reduce(
      (sum, count) => sum + count,
      0,
    );

    const totalProductViews = countsMap.get('product_viewed') || 0;

    const conversionRate = this.calculateConversionRate(
      conversionData.sessionsWithPurchases,
      conversionData.sessionsWithProductViews,
    );

    return {
      totalEvents,
      totalPageViews: countsMap.get('page_view') || 0,
      totalProductViews,
      totalAddToCarts: countsMap.get('add_to_cart') || 0,
      totalPurchases: countsMap.get('purchase_completed') || 0,
      totalRevenue: Number(revenueResult?.totalRevenue) || 0,
      conversionRate,
      topProducts: this.mapTopProducts(topProductsResult),
    };
  }

  private applyFilters(
    qb: SelectQueryBuilder<Event>,
    query: StatsQueryDto,
  ): SelectQueryBuilder<Event> {
    if (query.shopId) {
      qb.andWhere('event.shopId = :shopId', { shopId: query.shopId });
    }
    if (query.startDate) {
      qb.andWhere('event.timestamp >= :startDate', {
        startDate: query.startDate,
      });
    }
    if (query.endDate) {
      qb.andWhere('event.timestamp <= :endDate', { endDate: query.endDate });
    }
    return qb;
  }

  private async getEventCounts(
    query: StatsQueryDto,
  ): Promise<EventCountResult[]> {
    const qb = this.eventRepository
      .createQueryBuilder('event')
      .select('event.eventType', 'eventType')
      .addSelect('COUNT(*)', 'count');

    this.applyFilters(qb, query);

    return qb.groupBy('event.eventType').getRawMany<EventCountResult>();
  }

  private async getTotalRevenue(query: StatsQueryDto): Promise<RevenueResult> {
    const qb = this.eventRepository
      .createQueryBuilder('event')
      .select(
        "COALESCE(SUM(json_extract(event.properties, '$.revenue')), 0)",
        'totalRevenue',
      )
      .where('event.eventType = :eventType', {
        eventType: 'purchase_completed',
      });

    this.applyFilters(qb, query);

    const result = await qb.getRawOne<RevenueResult>();
    return result || { totalRevenue: null };
  }

  private async getTopProducts(
    query: StatsQueryDto,
    limit: number = 10,
  ): Promise<ProductCountResult[]> {
    const qb = this.eventRepository
      .createQueryBuilder('event')
      .select("json_extract(event.properties, '$.productId')", 'productId')
      .addSelect('COUNT(*)', 'count')
      .where('event.eventType = :eventType', {
        eventType: 'product_viewed',
      })
      .andWhere("json_extract(event.properties, '$.productId') IS NOT NULL");

    this.applyFilters(qb, query);

    return qb
      .groupBy("json_extract(event.properties, '$.productId')")
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany<ProductCountResult>();
  }

  private async getConversionData(query: StatsQueryDto): Promise<{
    sessionsWithProductViews: number;
    sessionsWithPurchases: number;
  }> {
    const productViewQb = this.eventRepository
      .createQueryBuilder('event')
      .select('COUNT(DISTINCT event.sessionId)', 'sessionCount')
      .where('event.eventType = :eventType', {
        eventType: 'product_viewed',
      });

    const purchaseQb = this.eventRepository
      .createQueryBuilder('event')
      .select('COUNT(DISTINCT event.sessionId)', 'sessionCount')
      .where('event.eventType = :eventType', {
        eventType: 'purchase_completed',
      });

    this.applyFilters(productViewQb, query);
    this.applyFilters(purchaseQb, query);

    const [productViewSessions, purchaseSessions] = await Promise.all([
      productViewQb.getRawOne<SessionCountResult>(),
      purchaseQb.getRawOne<SessionCountResult>(),
    ]);

    return {
      sessionsWithProductViews: Number(productViewSessions?.sessionCount) || 0,
      sessionsWithPurchases: Number(purchaseSessions?.sessionCount) || 0,
    };
  }

  private calculateConversionRate(
    sessionsWithPurchases: number,
    sessionsWithProductViews: number,
  ): number {
    if (sessionsWithProductViews === 0) {
      return 0;
    }
    const rate = (sessionsWithPurchases / sessionsWithProductViews) * 100;
    return Math.round(rate * 100) / 100;
  }

  private mapTopProducts(results: ProductCountResult[]): TopProduct[] {
    return results.map((result) => ({
      productId: result.productId,
      name: this.productMap.get(result.productId) || 'Unknown Product',
      count: Number(result.count),
    }));
  }
}
