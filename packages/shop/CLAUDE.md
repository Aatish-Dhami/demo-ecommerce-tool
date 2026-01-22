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
- Vite
- React Router (for navigation)

## Structure

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
    └── ...               # CSS/Tailwind styles
```

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | HomePage | Product grid with all products |
| `/product/:id` | ProductPage | Single product detail |
| `/cart` | CartPage | Shopping cart |
| `/checkout` | CheckoutPage | Checkout form |
| `/confirmation` | ConfirmationPage | Order confirmation |

## Tracked Events

The shop tracks these events via `@flowtel/tracker`:

| Event | Trigger | Properties |
|-------|---------|------------|
| `page_view` | Route change | `path`, `title` |
| `product_viewed` | View product detail | `productId`, `name`, `price` |
| `add_to_cart` | Click "Add to Cart" | `productId`, `name`, `price`, `quantity` |
| `remove_from_cart` | Remove from cart | `productId`, `name` |
| `checkout_started` | Navigate to checkout | `cartTotal`, `itemCount` |
| `purchase_completed` | Submit checkout | `orderId`, `total`, `items` |

## Cart State

Uses React Context for cart state:

```typescript
interface CartContextValue {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}
```

## Environment Variables

```bash
VITE_API_URL=http://localhost:4000    # Backend API URL
VITE_SHOP_ID=shop_123                  # Shop identifier for tracking
```

## Commands

```bash
pnpm dev      # Start dev server on :3000
pnpm build    # Production build
pnpm preview  # Preview production build
```

## Conventions

- Components in PascalCase directories
- One component per file
- Hooks prefixed with `use`
- Import products from `@flowtel/shared`
- Use `EventType` enum for tracking calls
