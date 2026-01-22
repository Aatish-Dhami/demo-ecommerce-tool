/**
 * Represents a top-performing product in analytics rankings.
 */
export interface TopProduct {
  /** Unique product identifier */
  productId: string;
  /** Product display name */
  name: string;
  /** Number of interactions (views, adds to cart, etc.) */
  count: number;
}

/**
 * Aggregated analytics statistics returned by the stats API endpoint.
 */
export interface Stats {
  /** Total number of tracked events */
  totalEvents: number;
  /** Count of page_view events */
  totalPageViews: number;
  /** Count of product_viewed events */
  totalProductViews: number;
  /** Count of add_to_cart events */
  totalAddToCarts: number;
  /** Count of purchase_completed events */
  totalPurchases: number;
  /** Sum of purchase revenue */
  totalRevenue: number;
  /** Percentage of sessions that converted (0-100) */
  conversionRate: number;
  /** Array of top products by activity */
  topProducts: TopProduct[];
}
