# Product Requirements Document (PRD)

## E-commerce Demo Shop + Event Tracker + Agentic Insights System

---

## 1. Executive Summary

Build a minimal e-commerce analytics platform demonstrating end-to-end event tracking, data ingestion, and AI-powered insights. The system consists of a demo shop, tracking SDK, event backend, and analytics dashboard.

---

## 2. Goals & Objectives

| Goal | Success Criteria |
|------|------------------|
| Demonstrate event tracking | Events captured for all user interactions |
| Real-time data ingestion | Events stored within 1s of occurrence |
| AI-powered insights | Generate actionable insights from raw events |
| Interactive analytics | Users can query data via natural language |

---

## 3. User Personas

- **Shop Visitor**: Browses products, adds to cart, completes purchase
- **Shop Owner/Analyst**: Views dashboard, reads insights, asks questions about metrics

---

## 4. Functional Requirements

### 4.1 E-commerce Shop (Frontend)

| ID | Requirement | Priority |
|----|-------------|----------|
| F1.1 | Display product list (3-10 products) | P0 |
| F1.2 | Product detail page with name, price, description, image | P0 |
| F1.3 | Add product to cart | P0 |
| F1.4 | Remove product from cart | P0 |
| F1.5 | View cart with item count and total | P0 |
| F1.6 | Checkout flow (fake, no payment) | P0 |
| F1.7 | Order confirmation page | P1 |

### 4.2 Tracking Script

| ID | Requirement | Priority |
|----|-------------|----------|
| F2.1 | Embeddable `<script>` tag initialization | P0 |
| F2.2 | Auto-capture page views | P0 |
| F2.3 | Track `product_viewed` event | P0 |
| F2.4 | Track `add_to_cart` event | P0 |
| F2.5 | Track `remove_from_cart` event | P0 |
| F2.6 | Track `checkout_started` event | P0 |
| F2.7 | Track `purchase_completed` event | P0 |
| F2.8 | Batch events and send to backend | P1 |
| F2.9 | Offline queue with retry | P2 |

### 4.3 Backend (NestJS + DDD/CQRS)

| ID | Requirement | Priority |
|----|-------------|----------|
| F3.1 | POST `/events` - ingest raw events | P0 |
| F3.2 | GET `/events` - list events (with filters) | P0 |
| F3.3 | GET `/stats` - aggregated metrics | P0 |
| F3.4 | Event validation and schema enforcement | P0 |
| F3.5 | Store events in persistent storage | P0 |
| F3.6 | CQRS: Separate command/query models | P1 |
| F3.7 | Domain events for decoupled processing | P1 |

### 4.4 Agentic Insights Workflow

| ID | Requirement | Priority |
|----|-------------|----------|
| F4.1 | Periodic insight generation (or on-demand) | P0 |
| F4.2 | Generate human-readable summaries | P0 |
| F4.3 | Identify trends (top products, cart abandonment) | P1 |
| F4.4 | Store generated insights | P0 |
| F4.5 | GET `/insights` - retrieve insights | P0 |

### 4.5 Analytics Dashboard (React)

| ID | Requirement | Priority |
|----|-------------|----------|
| F5.1 | Display key stats (total events, purchases, revenue) | P0 |
| F5.2 | Show event timeline/list | P1 |
| F5.3 | Display generated insights | P0 |
| F5.4 | Chat interface for querying analytics | P0 |
| F5.5 | POST `/chat` - send question, get LLM response | P0 |

---

## 5. Technical Requirements

### 5.1 Tech Stack

| Component | Technology |
|-----------|------------|
| Shop Frontend | React + TypeScript + Vite |
| Dashboard | React + TypeScript + Vite |
| Tracking Script | Vanilla TypeScript (bundled) |
| Backend | NestJS + TypeScript |
| Database | SQLite or PostgreSQL |
| LLM Integration | OpenAI API / Anthropic API |

### 5.2 Architecture

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

### 5.3 Event Schema

```typescript
interface TrackingEvent {
  id: string;
  shopId: string;
  sessionId: string;
  eventType: string;
  eventName: string;
  properties: Record<string, any>;
  timestamp: string;
  url: string;
  userAgent: string;
}
```

### 5.4 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events` | Ingest events (batch supported) |
| GET | `/api/events` | List events with filters |
| GET | `/api/stats` | Get aggregated statistics |
| GET | `/api/insights` | Get generated insights |
| POST | `/api/insights/generate` | Trigger insight generation |
| POST | `/api/chat` | Ask questions about analytics |
| GET | `/tracker.js` | Serve tracking script |

---

## 6. Data Models

### Event Aggregations (Stats)

```typescript
interface Stats {
  totalEvents: number;
  totalPageViews: number;
  totalProductViews: number;
  totalAddToCarts: number;
  totalPurchases: number;
  totalRevenue: number;
  conversionRate: number;
  topProducts: { productId: string; count: number }[];
}
```

### Insight

```typescript
interface Insight {
  id: string;
  generatedAt: string;
  type: 'summary' | 'trend' | 'anomaly';
  title: string;
  content: string;
  metadata: Record<string, any>;
}
```

---

## 7. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Event ingestion latency | < 500ms |
| Dashboard load time | < 2s |
| Tracker script size | < 10KB gzipped |
| API response time | < 200ms (p95) |

---

## 8. Out of Scope

- Real payment processing
- User authentication (shop visitors)
- Multi-tenant isolation
- Production deployment
- Rate limiting / abuse prevention

---

## 9. Milestones

| Phase | Deliverable |
|-------|-------------|
| 1 | Shop frontend + hardcoded products |
| 2 | Tracking script + event capture |
| 3 | Backend event ingestion + storage |
| 4 | Stats aggregation API |
| 5 | Insight generation workflow |
| 6 | Dashboard with stats + insights |
| 7 | Chat-with-analytics feature |
