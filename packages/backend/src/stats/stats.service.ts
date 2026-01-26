import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stats, TopProduct, products } from '@flowtel/shared';
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

  async getStats(shopId: string): Promise<Stats> {
    const [eventCounts, revenueResult, topProductsResult, conversionData] =
      await Promise.all([
        this.getEventCounts(shopId),
        this.getTotalRevenue(shopId),
        this.getTopProducts(shopId),
        this.getConversionData(shopId),
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

  private async getEventCounts(shopId: string): Promise<EventCountResult[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .select('event.eventType', 'eventType')
      .addSelect('COUNT(*)', 'count')
      .where('event.shopId = :shopId', { shopId })
      .groupBy('event.eventType')
      .getRawMany<EventCountResult>();
  }

  private async getTotalRevenue(shopId: string): Promise<RevenueResult> {
    const result = await this.eventRepository
      .createQueryBuilder('event')
      .select(
        "COALESCE(SUM(json_extract(event.properties, '$.revenue')), 0)",
        'totalRevenue',
      )
      .where('event.shopId = :shopId', { shopId })
      .andWhere('event.eventType = :eventType', {
        eventType: 'purchase_completed',
      })
      .getRawOne<RevenueResult>();

    return result || { totalRevenue: null };
  }

  private async getTopProducts(
    shopId: string,
    limit: number = 10,
  ): Promise<ProductCountResult[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .select("json_extract(event.properties, '$.productId')", 'productId')
      .addSelect('COUNT(*)', 'count')
      .where('event.shopId = :shopId', { shopId })
      .andWhere('event.eventType = :eventType', {
        eventType: 'product_viewed',
      })
      .andWhere("json_extract(event.properties, '$.productId') IS NOT NULL")
      .groupBy("json_extract(event.properties, '$.productId')")
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany<ProductCountResult>();
  }

  private async getConversionData(shopId: string): Promise<{
    sessionsWithProductViews: number;
    sessionsWithPurchases: number;
  }> {
    const [productViewSessions, purchaseSessions] = await Promise.all([
      this.eventRepository
        .createQueryBuilder('event')
        .select('COUNT(DISTINCT event.sessionId)', 'sessionCount')
        .where('event.shopId = :shopId', { shopId })
        .andWhere('event.eventType = :eventType', {
          eventType: 'product_viewed',
        })
        .getRawOne<SessionCountResult>(),
      this.eventRepository
        .createQueryBuilder('event')
        .select('COUNT(DISTINCT event.sessionId)', 'sessionCount')
        .where('event.shopId = :shopId', { shopId })
        .andWhere('event.eventType = :eventType', {
          eventType: 'purchase_completed',
        })
        .getRawOne<SessionCountResult>(),
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
