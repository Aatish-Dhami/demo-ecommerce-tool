# @flowtel/tracker

Embeddable JavaScript tracking script for capturing e-commerce events.

## Purpose

A lightweight, vanilla TypeScript tracking library that:
- Captures user interactions on e-commerce sites
- Batches and sends events to the backend (TODO)
- Persists session across page loads (TODO)
- Queues events when offline (TODO)

## Tech Stack

- Vanilla TypeScript (no framework dependencies)
- Bundled with esbuild
- Output: Single `tracker.js` file (IIFE format)

## Current Structure

```
src/
└── index.ts              # Main entry with tracker API
```

### Planned Structure (TODO)
```
src/
├── index.ts              # Main entry, global `tracker` object
├── core/
│   ├── Session.ts        # Session management
│   └── Queue.ts          # Event queue with batching
├── transport/
│   └── http.ts           # HTTP transport layer
└── utils/
    ├── storage.ts        # LocalStorage helpers
    └── uuid.ts           # UUID generation
```

## Current API

```typescript
// Initialize tracker
tracker.init(config: TrackerConfig): void

// Track custom event
tracker.track(eventType: string, properties?: object): void

// Get current config
tracker.getConfig(): TrackerConfig | null

// Check if initialized
tracker.isInitialized(): boolean
```

## Usage

### Embed in HTML

```html
<script src="http://localhost:4000/tracker.js"></script>
<script>
  tracker.init({
    shopId: 'shop_123',
    endpoint: 'http://localhost:4000/api/events',
    debug: true  // Enable console logging
  });
</script>
```

### Track Events

```javascript
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
```

## Configuration Options

```typescript
interface TrackerConfig {
  shopId: string;           // Required: Shop identifier
  endpoint: string;         // Required: API endpoint
  batchSize?: number;       // Events per batch (default: 10)
  flushInterval?: number;   // MS between flushes (default: 5000)
  debug?: boolean;          // Enable console logging (default: false)
}
```

## Implementation Status

| Feature | Status |
|---------|--------|
| `init()` with config validation | ✅ Done |
| `track()` method (logging only) | ✅ Done |
| `getConfig()` / `isInitialized()` | ✅ Done |
| Event queue with batching | ⏳ TODO |
| HTTP transport to backend | ⏳ TODO |
| Session ID generation | ⏳ TODO |
| localStorage persistence | ⏳ TODO |
| Offline queue with retry | ⏳ TODO |
| Auto page_view tracking | ⏳ TODO |

## Build

```bash
pnpm build       # Bundle to dist/tracker.js
pnpm build:min   # Minified production build
pnpm typecheck   # Type check without emit
pnpm clean       # Remove dist/
```

## Output

- `dist/tracker.js` - IIFE bundle exposing global `tracker` object
- No external runtime dependencies
- Target: < 10KB gzipped

## Conventions

- Types imported from `@flowtel/shared` (build-time only)
- Debug logs prefixed with `[Flowtel Tracker]`
- Warns on double initialization
- Throws on missing required config
