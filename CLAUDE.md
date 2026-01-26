# Flowtel - E-commerce Analytics Platform

E-commerce analytics platform with event tracking, AI-powered insights, and interactive dashboard.

## Package Scope

All packages use `@flowtel/` npm scope.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Demo Shop     │     │    Dashboard    │
│   (React)       │     │    (React)      │
└────────┬────────┘     └────────┬────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│ Tracker Script  │────▶│  NestJS Backend │
│ (tracker.js)    │     │  (DDD + CQRS)   │
└─────────────────┘     └────────┬────────┘
                                 │
                        ┌────────┴────────┐
                        ▼                 ▼
                ┌───────────┐    ┌───────────────┐
                │  Database │    │  LLM Service  │
                │  (Events) │    │  (Insights)   │
                └───────────┘    └───────────────┘
```

## Monorepo Structure

| Directory | Package | Description |
|-----------|---------|-------------|
| `packages/shared` | `@flowtel/shared` | Shared TypeScript types and utilities |
| `packages/shop` | `@flowtel/shop` | React e-commerce storefront |
| `packages/tracker` | `@flowtel/tracker` | Embeddable tracking script |
| `packages/backend` | `@flowtel/backend` | NestJS API server (DDD + CQRS) |
| `packages/dashboard` | `@flowtel/dashboard` | React analytics dashboard |

## Shared Types

Import from `@flowtel/shared`:

```typescript
// Types
import { TrackingEvent, Stats, Insight, Product, Cart } from '@flowtel/shared';

// Constants
import { EventType } from '@flowtel/shared';

// Data
import { products } from '@flowtel/shared';
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Shop Frontend | React + TypeScript + Vite |
| Dashboard | React + TypeScript + Vite |
| Tracking Script | Vanilla TypeScript (bundled) |
| Backend | NestJS + TypeScript |
| Database | SQLite or PostgreSQL |
| LLM Integration | OpenAI API / Anthropic API |

## Commands

```bash
# Install dependencies (from root)
pnpm install

# Development
pnpm dev              # Run all packages in dev mode
pnpm dev:shop         # Run shop only
pnpm dev:dashboard    # Run dashboard only
pnpm dev:backend      # Run backend only

# Build
pnpm build            # Build all packages
pnpm build:tracker    # Build tracker script

# Test
pnpm test             # Run all tests
pnpm test:backend     # Run backend tests

# Lint
pnpm lint             # Lint all packages
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events` | Ingest events (batch supported) |
| GET | `/api/events` | List events with filters |
| GET | `/api/stats` | Get aggregated statistics |
| GET | `/api/insights` | Get generated insights |
| POST | `/api/insights/generate` | Trigger insight generation |
| POST | `/api/chat` | Ask questions about analytics |
| GET | `/tracker.js` | Serve tracking script |

## Conventions

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- No default exports (use named exports)
- Prefer interfaces over types for object shapes

### Naming
- Files: `kebab-case.ts`
- Components: `PascalCase.tsx`
- Functions/variables: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Types/Interfaces: `PascalCase`

### Git
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- Branch naming: `feature/`, `fix/`, `chore/`

### Testing
- Unit tests alongside source files: `*.spec.ts`
- Integration tests in `__tests__/` directories
- E2E tests in `e2e/` directories

## Environment Variables

```bash
# Backend
DATABASE_URL=sqlite:./data.db
OPENAI_API_KEY=sk-...
PORT=4000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173  # Comma-separated, optional

# Shop
VITE_API_URL=http://localhost:4000
VITE_SHOP_ID=shop_123
VITE_API_KEY=demo_api_key
VITE_TRACKER_DEBUG=true

# Dashboard
VITE_API_URL=http://localhost:4000
```

## Implementation Status

| Package | Status | What's Done |
|---------|--------|-------------|
| `@flowtel/shared` | ✅ Complete | Types, DTOs, EventType enum, mock products |
| `@flowtel/tracker` | ✅ Functional | init, track, HTTP send with retry, auto page views |
| `@flowtel/shop` | ✅ Functional | Product list, detail (with tracking), cart (with tracking), checkout (checkout_started, purchase_completed events), order confirmation, tracker integration |
| `@flowtel/backend` | ✅ Functional | Database, Event entity, Events/Stats/Insights/Chat controllers, CORS configuration |
| `@flowtel/dashboard` | 🟡 Partial | React Router routing, DashboardLayout with sidebar nav, Stats/Events/Insights/Chat pages, API client service, StatsOverview connected to backend, environment configuration |

### Dashboard Environment Configuration
The dashboard uses type-safe environment configuration:
- `packages/dashboard/.env.example`: Template for environment variables
- `packages/dashboard/src/config.ts`: Centralized config module with type-safe access

```typescript
import { config } from './config';

// Available config properties:
config.apiUrl  // string - API endpoint URL (default: http://localhost:4000)
```

### Dashboard API Client

The dashboard uses a centralized API client service at `packages/dashboard/src/services/api.ts`:

```typescript
import { apiService } from './services/api';

// Available methods:
apiService.getStats(params?)           // GET /api/stats
apiService.getEvents(filters)          // GET /api/events
apiService.getInsights(filters?)       // GET /api/insights
apiService.generateInsights(request?)  // POST /api/insights/generate
apiService.sendChatMessage(request)    // POST /api/chat
```

### Dashboard StatsOverview
The StatsOverview page (`packages/dashboard/src/pages/StatsOverview.tsx`) displays real-time statistics:
- **Data fetching**: Uses `useStats` hook that calls `/api/stats` endpoint on mount
- **Loading state**: Displays spinner while fetching data
- **Error handling**: Shows user-friendly error messages with retry capability
- **Stats displayed**: Total Events, Purchases, Revenue, Conversion Rate
- **Auto-refresh**: Optional 30-second auto-refresh with manual refresh button
- **Responsive**: Grid layout adapts to screen size (4 → 2 → 1 columns)

### Shop Tracking Events
The shop tracks the following events:
- `page_view` - ProductList mount (url, path, page properties)
- `product_viewed` - ProductDetail page view
- `add_to_cart` - Add to cart action
- `remove_from_cart` - Remove from cart action
- `checkout_started` - Checkout page view
- `purchase_completed` - Order confirmation

### Dashboard Routing (TASK-79)
The dashboard uses React Router for client-side routing:
- `/` → StatsPage (wraps StatsOverview)
- `/events` → EventsPage
- `/insights` → InsightsPage
- `/chat` → ChatPage
- All routes wrapped with DashboardLayout (sidebar navigation with Outlet)

### Next Steps
1. ~~Integrate tracker into shop~~ ✅ Done (TASK-68, TASK-71)
2. ~~Add tracking to ProductList~~ ✅ Done (TASK-69)
3. ~~Connect StatsOverview to backend~~ ✅ Done (TASK-74)
4. ~~Connect EventsPage to backend API~~ ✅ Done (TASK-75)
5. ~~Configure dashboard routing~~ ✅ Done (TASK-79)
6. ~~Create NestJS ChatModule~~ ✅ Done (TASK-84) - ChatModule with ChatService and ChatController fully implemented
7. ~~Create NestJS LLMModule~~ ✅ Done (TASK-85) - Global LLM module with OpenAI/Anthropic support
8. ~~Add environment configuration to dashboard~~ ✅ Done (TASK-90)
9. Build more dashboard UI components (charts, visualizations)
10. Enhance AI insights generation

### Dashboard EventsPage Integration
The EventsPage is fully integrated with the backend API:
- `packages/dashboard/src/hooks/useEvents.ts`: Custom hook for fetching/filtering events
- `packages/dashboard/src/api/events.ts`: API function with query param support
- `packages/dashboard/src/components/EventList/`: EventList, EventFilters, Pagination components
- Supports: event type filtering, pagination, loading/error states

### Shop Tracker Integration
The shop uses a vite alias to import tracker source directly:
- `vite.config.ts`: Alias `@flowtel/tracker` to `../tracker/src/index.ts`
- `tsconfig.json`: Path mapping for TypeScript resolution
- `CartContext.tsx`: Tracks `add_to_cart` and `remove_from_cart` events

### Shop Configuration
The shop uses a centralized config module at `packages/shop/src/config.ts`:
```typescript
import { config } from './config';

// Available properties:
config.apiUrl        // VITE_API_URL (default: 'http://localhost:4000')
config.shopId        // VITE_SHOP_ID
config.apiKey        // VITE_API_KEY
config.trackerDebug  // VITE_TRACKER_DEBUG === 'true'
```

### Backend CORS Configuration
CORS is configured in `packages/backend/src/main.ts`:
- **Default origins**: localhost:3000 (shop), localhost:3001 (dashboard), localhost:5173 (Vite dev)
- **Environment variable**: Set `CORS_ORIGINS` to override defaults (comma-separated list)
- **Methods allowed**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Credentials**: Enabled

## Key Decisions

1. **Monorepo with pnpm workspaces** - Shared types, unified tooling
2. **TypeORM + SQLite** - Simple setup, easy to swap to PostgreSQL
3. **Vite for frontends** - Fast dev server, optimized builds
4. **Vanilla TS tracker** - Minimal bundle size, no framework dependencies
5. **ESM modules** - Modern JavaScript, tree-shakeable
