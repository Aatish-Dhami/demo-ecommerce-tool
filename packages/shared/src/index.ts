// Types
export { TrackingEvent } from './types/events.js';
export { TopProduct, Stats } from './types/stats.js';
export { InsightType, Insight } from './types/insights.js';
export { TrackerConfig } from './types/tracker.js';
export { Product } from './types/product.js';
export { Cart, CartItem } from './types/cart.js';

// Constants
export { EventType } from './constants/eventTypes.js';

// Data
export { products } from './data/products.js';

// API DTOs
export {
  CreateEventDto,
  EventsQueryDto,
  InsightsQueryDto,
  ChatRequestDto,
  ChatSource,
  ChatResponseDto,
  InsightGenerateRequestDto,
  PaginatedResponseDto,
} from './types/api.js';
