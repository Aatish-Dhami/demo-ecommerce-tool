# @flowtel/shop

React e-commerce storefront for the Flowtel demo platform.

## Purpose

A minimal e-commerce shop that demonstrates:
- Product browsing and detail views
- Shopping cart functionality
- Checkout flow (fake, no payment)
- Integration with `@flowtel/tracker` for event capture

## Tech Stack

- React 18
- TypeScript
- Vite 6.x
- React Router (TODO)

## Current Structure

```
src/
├── main.tsx              # App entry point
├── App.tsx               # Root component (scaffold)
├── App.css               # App styles
├── index.css             # Global styles
└── vite-env.d.ts         # Vite type declarations
```

### Planned Structure (TODO)
```
src/
├── main.tsx              # App entry point
├── App.tsx               # Root component with router
├── components/
│   ├── Layout/           # Header, Footer, Navigation
│   ├── ProductCard/      # Product grid item
│   ├── ProductDetail/    # Full product view
│   ├── Cart/             # Cart sidebar/page
│   └── Checkout/         # Checkout form
├── pages/
│   ├── HomePage.tsx      # Product list
│   ├── ProductPage.tsx   # Product detail
│   ├── CartPage.tsx      # Cart view
│   └── CheckoutPage.tsx  # Checkout flow
├── hooks/
│   ├── useCart.ts        # Cart state management
│   └── useTracker.ts     # Tracker integration
├── context/
│   └── CartContext.tsx   # Cart provider
└── styles/
    └── ...               # CSS styles
```

## Implementation Status

| Feature | Status |
|---------|--------|
| Vite + React scaffold | ✅ Done |
| Basic App component | ✅ Done |
| Product list page | ⏳ TODO |
| Product detail page | ⏳ TODO |
| Cart functionality | ⏳ TODO |
| Checkout flow | ⏳ TODO |
| Tracker integration | ⏳ TODO |
| React Router setup | ⏳ TODO |

## Pages & Routes (Planned)

| Route | Page | Description |
|-------|------|-------------|
| `/` | HomePage | Product grid with all products |
| `/product/:id` | ProductPage | Single product detail |
| `/cart` | CartPage | Shopping cart |
| `/checkout` | CheckoutPage | Checkout form |
| `/confirmation` | ConfirmationPage | Order confirmation |

## Tracked Events (Planned)

| Event | Trigger | Properties |
|-------|---------|------------|
| `page_view` | Route change | `path`, `title` |
| `product_viewed` | View product detail | `productId`, `name`, `price` |
| `add_to_cart` | Click "Add to Cart" | `productId`, `name`, `price`, `quantity` |
| `remove_from_cart` | Remove from cart | `productId`, `name` |
| `checkout_started` | Navigate to checkout | `cartTotal`, `itemCount` |
| `purchase_completed` | Submit checkout | `orderId`, `total`, `items` |

## Commands

```bash
pnpm dev      # Start dev server on :5173 (Vite default)
pnpm build    # Production build
pnpm preview  # Preview production build
```

## Environment Variables

```bash
VITE_API_URL=http://localhost:4000    # Backend API URL
VITE_SHOP_ID=shop_123                  # Shop identifier for tracking
```

## Conventions

- Components in PascalCase directories
- One component per file
- Hooks prefixed with `use`
- Import products from `@flowtel/shared`
- Use `EventType` enum for tracking calls
