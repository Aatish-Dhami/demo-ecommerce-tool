# @flowtel/tracker

Embeddable JavaScript tracking script for capturing e-commerce events.

## Purpose

A lightweight, vanilla TypeScript tracking library that:
- Captures user interactions on e-commerce sites
- Sends events to the backend with retry logic
- Auto-tracks page views on route changes
- Manages session across page loads

## Tech Stack

- Vanilla TypeScript (no framework dependencies)
- Bundled with esbuild
- Output: Single `tracker.js` file (IIFE format)

## Structure

```
src/
├── index.ts              # Main tracker API (init, track, destroy)
├── sender.ts             # HTTP transport with retry logic
└── pageview.ts           # Auto page view tracking
```

## API

```typescript
// Initialize tracker (required before tracking)
tracker.init({
  shopId: 'shop_123',
  endpoint: 'http://localhost:4000/api/events',
  apiKey: 'your_api_key',
  debug: true,                    // Optional: console logging
  autoTrackPageViews: true,       // Optional: auto track route changes
});

// Track custom event
tracker.track('add_to_cart', {
  productId: 'prod-001',
  name: 'Wireless Headphones',
  price: 149.99,
  quantity: 1,
});

// Manual page view (if autoTrackPageViews is false)
tracker.trackPageView();

// Get current state
tracker.getConfig();       // TrackerConfig | null
tracker.isInitialized();   // boolean
tracker.getSessionId();    // string | null

// Cleanup
tracker.destroy();
```

## Usage

### Embed in HTML

```html
<script src="http://localhost:4000/tracker.js"></script>
<script>
  tracker.init({
    shopId: 'shop_123',
    endpoint: 'http://localhost:4000/api/events',
    apiKey: 'your_api_key',
    debug: true
  });
</script>
```

### Track E-commerce Events

```javascript
// Product viewed
tracker.track('product_viewed', {
  productId: 'prod-001',
  name: 'Wireless Headphones',
  price: 149.99
});

// Add to cart
tracker.track('add_to_cart', {
  productId: 'prod-001',
  quantity: 1,
  price: 149.99
});

// Purchase completed
tracker.track('purchase_completed', {
  orderId: 'ord-123',
  total: 149.99,
  items: [{ productId: 'prod-001', quantity: 1 }]
});
```

## Configuration Options

```typescript
interface TrackerConfig {
  shopId: string;              // Required: Shop identifier
  endpoint: string;            // Required: API endpoint
  apiKey: string;              // Required: API key for auth
  batchSize?: number;          // Events per batch (default: 10)
  flushInterval?: number;      // MS between flushes (default: 5000)
  debug?: boolean;             // Enable console logging (default: false)
  autoTrackPageViews?: boolean; // Auto track route changes (default: true)
}
```

## HTTP Transport (sender.ts)

- POST events to configured endpoint
- Automatic retry with exponential backoff
- Max 3 retries for server errors (5xx) and network failures
- No retry for client errors (4xx)
- Debug logging for send status

## Page View Tracking (pageview.ts)

- Listens to `popstate` events (browser back/forward)
- Listens to `pushState`/`replaceState` via monkey-patching
- Tracks: `path`, `title`, `referrer`
- Cleanup on `tracker.destroy()`

## Implementation Status

| Feature | Status |
|---------|--------|
| `init()` with config validation | ✅ Done |
| `track()` with HTTP send | ✅ Done |
| HTTP transport with retry | ✅ Done |
| Auto page view tracking | ✅ Done |
| Session ID generation | ✅ Done |
| `destroy()` cleanup | ✅ Done |
| Event batching | ⏳ TODO |
| localStorage queue persistence | ⏳ TODO |
| Offline queue with retry | ⏳ TODO |

## Build

```bash
pnpm build       # Bundle to dist/tracker.js
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
- Throws on missing required config (shopId, endpoint, apiKey)
