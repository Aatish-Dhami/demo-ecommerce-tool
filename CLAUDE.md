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

# Shop
VITE_API_URL=http://localhost:4000
VITE_SHOP_ID=shop_123

# Dashboard
VITE_API_URL=http://localhost:4000
```

## Implementation Status

| Package | Status | What's Done |
|---------|--------|-------------|
| `@flowtel/shared` | ✅ Complete | Types, DTOs, EventType enum, mock products |
| `@flowtel/tracker` | ✅ Functional | init, track, HTTP send with retry, auto page views |
| `@flowtel/shop` | ✅ Functional | Product list, detail, cart, checkout, order confirmation |
| `@flowtel/backend` | 🟡 Partial | Database, Event entity, Events service (needs controller) |
| `@flowtel/dashboard` | ⏳ Scaffold | Basic React app only |

### Next Steps
1. Add Events controller to backend (POST/GET `/api/events`)
2. Integrate tracker into shop
3. Build dashboard UI (stats, charts, event list)
4. Add AI insights generation

## Key Decisions

1. **Monorepo with pnpm workspaces** - Shared types, unified tooling
2. **TypeORM + SQLite** - Simple setup, easy to swap to PostgreSQL
3. **Vite for frontends** - Fast dev server, optimized builds
4. **Vanilla TS tracker** - Minimal bundle size, no framework dependencies
5. **ESM modules** - Modern JavaScript, tree-shakeable
