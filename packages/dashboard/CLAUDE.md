# @flowtel/dashboard

React analytics dashboard for viewing stats, insights, and chatting with data.

## Purpose

An analytics dashboard that:
- Displays key metrics and statistics
- Shows AI-generated insights
- Provides chat interface for querying analytics
- Visualizes event timelines

## Tech Stack

- React 18
- TypeScript
- Vite 5.x
- Chart library (TODO - Recharts or Chart.js)
- TanStack Query (TODO)

## Current Structure

```
src/
├── main.tsx              # App entry point
└── App.tsx               # Root component (scaffold)
```

### Planned Structure (TODO)
```
src/
├── main.tsx              # App entry point
├── App.tsx               # Root component
├── components/
│   ├── Layout/           # Dashboard layout
│   ├── StatCard/         # Metric display card
│   ├── Chart/            # Chart components
│   ├── InsightCard/      # Insight display
│   ├── EventList/        # Event timeline
│   └── Chat/             # Chat interface
├── pages/
│   ├── OverviewPage.tsx  # Main dashboard
│   ├── EventsPage.tsx    # Event explorer
│   ├── InsightsPage.tsx  # Insights list
│   └── ChatPage.tsx      # Chat with analytics
├── hooks/
│   ├── useStats.ts       # Stats API hook
│   ├── useEvents.ts      # Events API hook
│   ├── useInsights.ts    # Insights API hook
│   └── useChat.ts        # Chat API hook
├── api/
│   └── client.ts         # API client config
└── styles/
    └── ...               # CSS styles
```

## Implementation Status

| Feature | Status |
|---------|--------|
| Vite + React scaffold | ✅ Done |
| Basic App component | ✅ Done |
| Overview page | ⏳ TODO |
| Stats cards | ⏳ TODO |
| Charts | ⏳ TODO |
| Events list | ⏳ TODO |
| Insights display | ⏳ TODO |
| Chat interface | ⏳ TODO |
| API integration | ⏳ TODO |

## Pages & Routes (Planned)

| Route | Page | Description |
|-------|------|-------------|
| `/` | OverviewPage | Main dashboard with stats |
| `/events` | EventsPage | Event timeline & filters |
| `/insights` | InsightsPage | AI-generated insights |
| `/chat` | ChatPage | Chat with analytics |

## Dashboard Sections (Planned)

### Overview Page
- **Stat Cards**: Total events, page views, purchases, revenue
- **Conversion Funnel**: Views → Cart → Purchase
- **Top Products**: Most viewed/purchased
- **Recent Events**: Last 10 events

### Events Page
- **Event List**: Filterable, paginated
- **Filters**: Event type, date range, session
- **Event Detail**: Click to expand properties

### Insights Page
- **Insight Cards**: AI-generated insights
- **Categories**: Summary, Trend, Anomaly
- **Generate Button**: Trigger new insights

### Chat Page
- **Chat Interface**: Message history
- **Input**: Natural language questions
- **Responses**: AI answers with data context

## Commands

```bash
pnpm dev      # Start dev server on :5173 (Vite default)
pnpm build    # Production build
pnpm preview  # Preview production build
```

## Environment Variables

```bash
VITE_API_URL=http://localhost:4000    # Backend API URL
```

## Conventions

- Components in PascalCase directories
- Hooks prefixed with `use`
- API calls through TanStack Query hooks
- Use `@flowtel/shared` types for API responses
- Responsive design (mobile-friendly)
- Accessible (ARIA labels, keyboard nav)
