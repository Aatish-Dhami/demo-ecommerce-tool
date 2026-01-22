# @flowtel/backend

NestJS API server with DDD + CQRS architecture for event ingestion and analytics.

## Purpose

Backend server that:
- Ingests tracking events from the tracker script
- Stores events in a database
- Provides aggregated statistics
- Generates AI-powered insights
- Serves the tracker script

## Tech Stack

- NestJS 10.x + TypeScript
- SQLite (dev) / PostgreSQL (prod)
- TypeORM or Prisma (TODO)
- OpenAI / Anthropic API for insights (TODO)

## Current Structure

```
src/
├── main.ts               # Bootstrap with CORS config
└── app.module.ts         # Root module (empty)
```

### Planned Structure (TODO)
```
src/
├── main.ts                    # Bootstrap
├── app.module.ts              # Root module
├── modules/
│   ├── events/                # Event Bounded Context
│   │   ├── domain/
│   │   │   ├── entities/      # Event aggregate
│   │   │   └── value-objects/ # EventType, Timestamp
│   │   ├── application/
│   │   │   ├── commands/      # IngestEvent command
│   │   │   └── queries/       # ListEvents, GetStats queries
│   │   ├── infrastructure/
│   │   │   ├── repositories/  # Event repository impl
│   │   │   └── persistence/   # TypeORM entities
│   │   └── presentation/
│   │       └── events.controller.ts
│   │
│   ├── insights/              # Insights Bounded Context
│   │   ├── application/
│   │   │   ├── commands/      # GenerateInsight command
│   │   │   └── queries/       # ListInsights query
│   │   ├── infrastructure/
│   │   │   └── llm/           # LLM service adapters
│   │   └── presentation/
│   │       └── insights.controller.ts
│   │
│   └── chat/                  # Chat Bounded Context
│       ├── application/
│       │   └── commands/      # AskQuestion command
│       └── presentation/
│           └── chat.controller.ts
│
├── shared/
│   ├── cqrs/                  # CQRS infrastructure
│   └── database/              # Database config
└── static/
    └── tracker.js             # Served tracker script
```

## Current Configuration

### CORS
Configured to allow requests from:
- `http://localhost:3000` (shop)
- `http://localhost:5173` (Vite dev)
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS

### Port
Default: `4000` (configurable via `PORT` env var)

## API Endpoints (Planned)

| Method | Endpoint | Handler | Status |
|--------|----------|---------|--------|
| POST | `/api/events` | IngestEventCommand | ⏳ TODO |
| GET | `/api/events` | ListEventsQuery | ⏳ TODO |
| GET | `/api/stats` | GetStatsQuery | ⏳ TODO |
| GET | `/api/insights` | ListInsightsQuery | ⏳ TODO |
| POST | `/api/insights/generate` | GenerateInsightCommand | ⏳ TODO |
| POST | `/api/chat` | AskQuestionCommand | ⏳ TODO |
| GET | `/tracker.js` | Static | ⏳ TODO |

## Implementation Status

| Feature | Status |
|---------|--------|
| NestJS bootstrap | ✅ Done |
| CORS configuration | ✅ Done |
| AppModule scaffold | ✅ Done |
| Events module | ⏳ TODO |
| Database setup | ⏳ TODO |
| Stats aggregation | ⏳ TODO |
| Insights module | ⏳ TODO |
| Chat module | ⏳ TODO |
| Serve tracker.js | ⏳ TODO |

## Commands

```bash
pnpm start:dev   # Start dev server with hot reload
pnpm build       # Production build
pnpm start       # Start production server
pnpm test        # Run unit tests
pnpm test:e2e    # Run e2e tests
```

## Environment Variables

```bash
PORT=4000
DATABASE_URL=sqlite:./data.db
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=sk-ant-...
```

## Conventions

- One module per bounded context
- Commands mutate, queries read
- Domain logic in domain layer, not controllers
- Use `@flowtel/shared` types for API contracts
- All dates in ISO 8601 / UTC
- Validate with class-validator
