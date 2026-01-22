# @flowtel/shared

Shared TypeScript types, constants, and mock data for the Flowtel analytics platform.

## Purpose

This package provides:
- Type definitions shared across all packages
- Event type enums for type-safe tracking
- Mock product data for the demo shop

## Structure

```
src/
├── index.ts              # Main barrel export
├── types/
│   ├── events.ts         # TrackingEvent interface
│   ├── stats.ts          # Stats, TopProduct interfaces
│   ├── insights.ts       # Insight, InsightType interfaces
│   ├── product.ts        # Product interface
│   ├── cart.ts           # Cart, CartItem interfaces
│   └── tracker.ts        # TrackerConfig interface
├── constants/
│   └── eventTypes.ts     # EventType enum
└── data/
    └── products.ts       # Mock product catalog
```

## Exports

### Types
- `TrackingEvent` - Core event structure for tracking
- `Stats`, `TopProduct` - Aggregated analytics data
- `Insight`, `InsightType` - AI-generated insights
- `Product` - Product catalog item
- `Cart`, `CartItem` - Shopping cart structures
- `TrackerConfig` - Configuration for tracker script initialization

### Constants
- `EventType` - Enum of all tracking event types:
  - `PAGE_VIEW`
  - `PRODUCT_VIEWED`
  - `ADD_TO_CART`
  - `REMOVE_FROM_CART`
  - `CHECKOUT_STARTED`
  - `PURCHASE_COMPLETED`

### Data
- `products` - Array of 8 mock products for demo shop

## Usage

```typescript
import {
  TrackingEvent,
  Product,
  EventType,
  products
} from '@flowtel/shared';

// Type-safe event handling
const event: TrackingEvent = {
  id: 'evt-123',
  shopId: 'shop_123',
  sessionId: 'sess-abc',
  eventType: EventType.ADD_TO_CART,
  eventName: 'Add to Cart',
  properties: { productId: 'prod-001', quantity: 1 },
  timestamp: new Date().toISOString(),
  url: '/products/prod-001',
  userAgent: navigator.userAgent,
};
```

## Build

```bash
pnpm build   # Compiles TypeScript to dist/
pnpm clean   # Removes dist/
```

## Conventions

- All types use interfaces (not type aliases)
- All exports are named (no default exports)
- Types have JSDoc comments for documentation
- Product IDs follow pattern: `prod-XXX`
- Event IDs follow pattern: `evt-XXX`
