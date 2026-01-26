# @flowtel/shared

Shared TypeScript types, constants, and mock data for the Flowtel analytics platform.

## Purpose

This package provides:
- Type definitions shared across all packages
- Event type enums for type-safe tracking
- API DTOs for request/response contracts
- Mock product data for the demo shop

## Tech Stack

- TypeScript 5.x
- ESM module format (`"type": "module"`)

## Structure

```
src/
├── index.ts              # Main barrel export
├── types/
│   ├── api.ts            # API request/response DTOs
│   ├── events.ts         # TrackingEvent interface
│   ├── stats.ts          # Stats, TopProduct interfaces
│   ├── insights.ts       # Insight, InsightType interfaces
│   ├── product.ts        # Product interface
│   ├── cart.ts           # Cart, CartItem interfaces
│   └── tracker.ts        # TrackerConfig interface
├── constants/
│   └── eventTypes.ts     # EventType enum
└── data/
    └── products.ts       # Mock product catalog (8 items)
```

## Exports

### Types
- `TrackingEvent` - Core event structure for tracking
- `Stats`, `TopProduct` - Aggregated analytics data
- `Insight`, `InsightType` - AI-generated insights
- `Product` - Product catalog item
- `Cart`, `CartItem` - Shopping cart structures
- `TrackerConfig` - Configuration for tracker script initialization

### API DTOs
- `CreateEventDto` - Event ingestion request
- `EventsQueryDto` - Event list query params
- `PaginatedResponseDto<T>` - Paginated response wrapper
- `ChatRequestDto`, `ChatResponseDto`, `ChatSource` - Chat API
- `InsightGenerateRequestDto` - Insight generation request

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
  // Types
  TrackingEvent,
  Product,
  Cart,
  CartItem,
  TrackerConfig,

  // API DTOs
  CreateEventDto,
  EventsQueryDto,
  PaginatedResponseDto,

  // Constants
  EventType,

  // Data
  products,
} from '@flowtel/shared';
```

## Build

```bash
pnpm build   # Compiles TypeScript to dist/
pnpm clean   # Removes dist/
```

## Package Config

- ESM only (`"type": "module"`)
- Exports map for proper module resolution
- TypeScript declarations included

## Conventions

- All types use interfaces (not type aliases)
- All exports are named (no default exports)
- Types have JSDoc comments for documentation
- Product IDs follow pattern: `prod-XXX`
- Event IDs follow pattern: `evt-XXX`
