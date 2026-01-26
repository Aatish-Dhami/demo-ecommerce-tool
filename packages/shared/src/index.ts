// Types
export { TrackingEvent } from './types/events';
export { TopProduct, Stats } from './types/stats';
export { InsightType, Insight } from './types/insights';
export { TrackerConfig } from './types/tracker';
export { Product } from './types/product';
export { Cart, CartItem } from './types/cart';

// Data
export { products } from './data/products';

// API DTOs
export {
  CreateEventDto,
  EventsQueryDto,
  ChatRequestDto,
  ChatSource,
  ChatResponseDto,
  InsightGenerateRequestDto,
  PaginatedResponseDto,
} from './types/api';
