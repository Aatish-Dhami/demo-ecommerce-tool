# @flowtel/backend

NestJS API server for event ingestion and analytics.

## Purpose

Backend server that:
- Ingests tracking events from the tracker script
- Stores events in SQLite database
- Provides paginated event queries with filters
- Will generate AI-powered insights (TODO)

## Tech Stack

- NestJS 10.x + TypeScript
- TypeORM with SQLite (better-sqlite3)
- OpenAI / Anthropic API for insights (TODO)

## Structure

```
src/
├── main.ts                       # Bootstrap with CORS config
├── app.module.ts                 # Root module
├── database/
│   ├── database.module.ts        # TypeORM module config
│   └── database.config.ts        # Database connection options
├── events/
│   ├── events.module.ts          # Events feature module
│   ├── events.service.ts         # Event CRUD operations
│   ├── events.controller.ts      # REST endpoints (TODO)
│   └── entities/
│       └── event.entity.ts       # Event TypeORM entity
└── insights/
    └── entities/
        └── insight.entity.ts     # Insight TypeORM entity
```

## Database

### Event Entity
```typescript
@Entity('events')
class Event {
  id: string;           // UUID primary key
  shopId: string;       // Shop identifier (indexed)
  sessionId: string;    // Session identifier
  eventType: string;    // Event type (indexed)
  eventName: string;    // Human-readable name
  properties: object;   // JSON properties
  timestamp: string;    // ISO timestamp (indexed)
  url: string;          // Page URL
  userAgent: string;    // Browser user agent
  createdAt: Date;      // Auto-generated
}
```

### Insight Entity
```typescript
@Entity('insights')
class Insight {
  id: string;
  shopId: string;
  type: string;         // 'summary' | 'trend' | 'anomaly'
  title: string;
  content: string;
  metadata: object;
  generatedAt: string;
  createdAt: Date;
}
```

## Events Service

```typescript
// Create single event
eventsService.create(dto: CreateEventDto): Promise<Event>

// Create batch of events
eventsService.createBatch(dtos: CreateEventDto[]): Promise<Event[]>

// Query with filters and pagination
eventsService.findAll(filters: EventsQueryDto): Promise<PaginatedResponseDto<Event>>

// Get all events for a shop
eventsService.findByShopId(shopId: string): Promise<Event[]>
```

### Query Filters
- `shopId` - Filter by shop
- `sessionId` - Filter by session
- `eventType` - Filter by event type
- `startDate` / `endDate` - Date range filter
- `page` / `limit` - Pagination (default: page 1, limit 20)

## API Endpoints

| Method | Endpoint | Handler | Status |
|--------|----------|---------|--------|
| POST | `/api/events` | Create event(s) | ⏳ TODO (controller) |
| GET | `/api/events` | List events | ⏳ TODO (controller) |
| GET | `/api/stats` | Get stats | ⏳ TODO |
| GET | `/api/insights` | List insights | ⏳ TODO |
| POST | `/api/insights/generate` | Generate insights | ⏳ TODO |
| POST | `/api/chat` | Chat with data | ⏳ TODO |
| GET | `/tracker.js` | Serve tracker | ⏳ TODO |

## CORS Configuration

Allowed origins:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS

## Implementation Status

| Feature | Status |
|---------|--------|
| NestJS bootstrap | ✅ Done |
| CORS configuration | ✅ Done |
| Database module (TypeORM + SQLite) | ✅ Done |
| Event entity | ✅ Done |
| Insight entity | ✅ Done |
| Events service (CRUD) | ✅ Done |
| Events controller | ⏳ TODO |
| Stats aggregation | ⏳ TODO |
| Insights module | ⏳ TODO |
| Chat module | ⏳ TODO |
| Serve tracker.js | ⏳ TODO |

## Commands

```bash
pnpm start:dev   # Start dev server with hot reload
pnpm build       # Production build
pnpm start       # Start production server
pnpm start:prod  # Start from dist/
```

## Environment Variables

```bash
PORT=4000
DATABASE_URL=sqlite:./data/flowtel.db
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=sk-ant-...
```

## Data Storage

- SQLite database stored at `data/flowtel.db`
- Auto-synced on startup (`synchronize: true` in dev)
- Indexes on `shopId`, `eventType`, `timestamp` for query performance

## Conventions

- Use `@flowtel/shared` types for API contracts
- All dates in ISO 8601 / UTC
- UUIDs for all entity IDs
- JSON stored in `simple-json` TypeORM columns
