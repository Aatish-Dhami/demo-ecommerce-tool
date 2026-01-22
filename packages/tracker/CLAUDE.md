# @flowtel/tracker

Embeddable JavaScript tracking script for capturing e-commerce events.

## Purpose

A lightweight, vanilla TypeScript tracking library that:
- Captures user interactions on e-commerce sites
- Batches and sends events to the backend
- Persists session across page loads
- Queues events when offline

## Tech Stack

- Vanilla TypeScript (no framework dependencies)
- Bundled with Rollup/esbuild
- Output: Single `tracker.js` file

## Structure

```
src/
├── index.ts              # Main entry, global `tracker` object
├── core/
│   ├── Tracker.ts        # Main tracker class
│   ├── Session.ts        # Session management
│   └── Queue.ts          # Event queue with batching
├── events/
│   ├── pageView.ts       # Auto page view tracking
│   └── helpers.ts        # Event creation helpers
├── transport/
│   └── http.ts           # HTTP transport layer
└── utils/
    ├── storage.ts        # LocalStorage helpers
    └── uuid.ts           # UUID generation
```

## Usage

### Embed in HTML

```html
<script src="http://localhost:4000/tracker.js"></script>
<script>
  tracker.init({
    shopId: 'shop_123',
    endpoint: 'http://localhost:4000/api/events'
  });
</script>
```

### Track Events

```javascript
// Auto-tracked on init
// - page_view (every navigation)

// Manual tracking
tracker.track('product_viewed', {
  productId: 'prod-001',
  name: 'Wireless Headphones',
  price: 149.99
});

tracker.track('add_to_cart', {
  productId: 'prod-001',
  quantity: 1,
  price: 149.99
});

tracker.track('purchase_completed', {
  orderId: 'ord-123',
  total: 149.99,
  items: [{ productId: 'prod-001', quantity: 1 }]
});
```

## Configuration Options

```typescript
interface TrackerConfig {
  shopId: string;           // Required: Shop identifier
  endpoint: string;         // Required: API endpoint
  batchSize?: number;       // Events per batch (default: 10)
  flushInterval?: number;   // MS between flushes (default: 5000)
  debug?: boolean;          // Enable console logging
}
```

## Event Structure

All events follow the `TrackingEvent` interface from `@flowtel/shared`:

```typescript
{
  id: string;           // Auto-generated UUID
  shopId: string;       // From config
  sessionId: string;    // Auto-generated, persisted
  eventType: string;    // EventType enum value
  eventName: string;    // Human-readable name
  properties: object;   // Event-specific data
  timestamp: string;    // ISO 8601
  url: string;          // Current page URL
  userAgent: string;    // Browser user agent
}
```

## Session Management

- Session ID generated on first visit
- Stored in localStorage: `flowtel_session_id`
- Persists across page reloads
- New session after 30 minutes of inactivity

## Batching & Offline

- Events queued in memory
- Flushed every `flushInterval` ms or when `batchSize` reached
- On flush failure, events kept in queue for retry
- Queue persisted to localStorage on page unload

## Build

```bash
pnpm build     # Bundle to dist/tracker.js
pnpm build:min # Minified production build
```

## Size Budget

- Target: < 10KB gzipped
- No external dependencies
- Tree-shakeable internals

## Conventions

- Use `EventType` enum from `@flowtel/shared`
- All times in ISO 8601 format
- UUIDs for event and session IDs
- No PII in events (no emails, names, etc.)
