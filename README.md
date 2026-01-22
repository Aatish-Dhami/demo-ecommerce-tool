# demo-ecommerce-tool

## Problem Statement

Build a minimal **E-commerce Demo Shop + Event Tracker + Agentic Insights Backend + Dashboard** system:

1. A small e-commerce shop frontend (React) where users can browse products and "purchase"
2. A tracking snippet that captures commerce events (GA/Mixpanel-lite)
3. A backend that ingests + stores raw events (**NestJS + TypeScript**, **DDD + CQRS**)
4. A backend agent workflow that generates **human-readable insights** from commerce events
5. A **React dashboard** that can:
   - View stats (aggregations)
   - View generated insights
   - Ask an LLM questions about the shop's metrics/events (a simple "chat with analytics")

---

## Components To Build

### A) E-commerce Demo Shop (Frontend) — REQUIRED

Build a simple shop (TypeScript + React, **NOT Next.js**) with:

#### Pages / Views (minimum)
- **Product List** (3–10 hardcoded products is fine)
- **Product Detail**
- **Cart**
- **Checkout (fake purchase)**

#### Required interactions
- Add to cart
- Remove from cart
- Start checkout
- Complete purchase (fake)

No payments needed. Products can be hardcoded JSON.

---

### B) Tracking Script Snippet — REQUIRED

Build a client-side tracking script embeddable into the shop that sends events to your backend.

Example embed:
```html
<script src="http://localhost:3000/tracker.js"></script>
<script>
  tracker.init({
    apiKey: "demo-shop",
    endpoint: "http://localhost:4000",
    shopId: "shop_123"
  });
</script>
```
