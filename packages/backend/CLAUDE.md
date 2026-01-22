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

- NestJS + TypeScript
- SQLite (dev) / PostgreSQL (prod)
- TypeORM or Prisma
- OpenAI / Anthropic API for insights

## Architecture

Using Domain-Driven Design (DDD) with CQRS pattern:

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
│   │   ├── domain/
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

## API Endpoints

| Method | Endpoint | Handler | Description |
|--------|----------|---------|-------------|
| POST | `/api/events` | IngestEventCommand | Ingest events (batch) |
| GET | `/api/events` | ListEventsQuery | List events with filters |
| GET | `/api/stats` | GetStatsQuery | Aggregated statistics |
| GET | `/api/insights` | ListInsightsQuery | Generated insights |
| POST | `/api/insights/generate` | GenerateInsightCommand | Trigger generation |
| POST | `/api/chat` | AskQuestionCommand | Chat with analytics |
| GET | `/tracker.js` | Static | Serve tracker script |

## CQRS Pattern

### Commands (Write Operations)
- Validate input
- Update domain state
- Emit domain events
- Return void or ID

### Queries (Read Operations)
- No side effects
- Return DTOs
- Can use read-optimized models

```typescript
// Command example
@CommandHandler(IngestEventCommand)
export class IngestEventHandler {
  async execute(command: IngestEventCommand): Promise<void> {
    const event = EventAggregate.create(command.data);
    await this.repository.save(event);
    this.eventBus.publish(new EventIngestedEvent(event.id));
  }
}

// Query example
@QueryHandler(GetStatsQuery)
export class GetStatsHandler {
  async execute(query: GetStatsQuery): Promise<Stats> {
    return this.statsReadModel.getStats(query.shopId, query.dateRange);
  }
}
```

## Domain Events

- `EventIngested` - New tracking event stored
- `InsightGenerated` - AI insight created
- `StatsUpdated` - Aggregations recalculated

## Environment Variables

```bash
PORT=4000
DATABASE_URL=sqlite:./data.db
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=sk-ant-...
```

## Commands

```bash
pnpm dev       # Start dev server with hot reload
pnpm build     # Production build
pnpm start     # Start production server
pnpm test      # Run unit tests
pnpm test:e2e  # Run e2e tests
```

## Conventions

- One module per bounded context
- Commands mutate, queries read
- Domain logic in domain layer, not controllers
- Use `@flowtel/shared` types for API contracts
- All dates in ISO 8601 / UTC
- Validate with class-validator
