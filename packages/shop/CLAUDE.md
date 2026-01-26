# @flowtel/shop

React e-commerce storefront for the Flowtel demo platform.

## Purpose

A functional e-commerce shop that demonstrates:
- Product browsing and detail views
- Shopping cart with localStorage persistence
- Checkout flow (demo, no real payment)
- Integration with `@flowtel/tracker` for event capture

## Tech Stack

- React 18
- TypeScript
- Vite 6.x
- React Router 6

## Structure

```
src/
├── main.tsx                    # App entry with providers
├── App.tsx                     # Root component with RouterProvider
├── routes.tsx                  # Route definitions
├── components/
│   ├── index.ts                # Component barrel export
│   ├── Layout/
│   │   ├── Layout.tsx          # Header + Outlet + Footer
│   │   └── index.ts
│   ├── Cart/
│   │   ├── Cart.tsx            # Cart sidebar/drawer
│   │   └── CartItem.tsx        # Individual cart item
│   ├── Checkout/
│   │   └── Checkout.tsx        # Checkout form
│   ├── ProductDetail/
│   │   └── ProductDetail.tsx   # Full product view
│   ├── product-card.tsx        # Product grid item
│   ├── product-list.tsx        # Product grid
│   └── OrderConfirmation.tsx   # Order success message
├── pages/
│   ├── index.ts                # Page barrel export
│   ├── HomePage.tsx            # Product list
│   ├── ProductPage.tsx         # Product detail
│   ├── CartPage.tsx            # Cart view
│   ├── CheckoutPage.tsx        # Checkout flow
│   └── OrderConfirmationPage.tsx
├── context/
│   └── CartContext.tsx         # Cart state provider
├── hooks/
│   └── useCart.ts              # Cart context hook
└── styles/
    ├── App.css
    └── index.css
```

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | HomePage | Product grid with all 8 products |
| `/product/:id` | ProductPage | Single product detail |
| `/cart` | CartPage | Shopping cart |
| `/checkout` | CheckoutPage | Checkout form |
| `/confirmation` | OrderConfirmationPage | Order success |

## Cart Context

```typescript
interface CartContextValue {
  cart: Cart;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;  // Decrement qty
  removeItem: (productId: string) => void;       // Remove entirely
  clearCart: () => void;
  getTotal: () => number;
}
```

- Persisted to localStorage (`flowtel_cart`)
- Auto-loads on mount
- Auto-saves on cart changes

## Components

### Layout
- Header with nav links (Home, Cart)
- Cart item count badge
- Outlet for nested routes

### ProductCard
- Product image, name, price
- "Add to Cart" button
- Link to product detail

### ProductList
- Grid of ProductCards
- Uses products from `@flowtel/shared`

### ProductDetail
- Full product info
- Quantity selector
- Add to cart button

### Cart / CartItem
- List of cart items
- Quantity +/- controls
- Remove item button
- Cart total

### Checkout
- Customer info form (name, email, address)
- Order summary
- Place order button
- Clears cart on success

## Implementation Status

| Feature | Status |
|---------|--------|
| Vite + React + Router | ✅ Done |
| Layout with header/nav | ✅ Done |
| Product list page | ✅ Done |
| Product detail page | ✅ Done |
| Cart context + persistence | ✅ Done |
| Cart page | ✅ Done |
| Checkout page | ✅ Done |
| Order confirmation | ✅ Done |
| Tracker integration | ✅ Done |
| ProductDetail tracking | ✅ Done |

## Tracked Events

| Event | Trigger | Properties | Status |
|-------|---------|------------|--------|
| `page_view` | Route change | `path`, `title` | ✅ Auto |
| `product_viewed` | View product detail | `productId`, `productName`, `price` | ✅ Done |
| `add_to_cart` | Click "Add to Cart" | `productId`, `name`, `price`, `quantity` | ⏳ TODO |
| `remove_from_cart` | Remove from cart | `productId`, `name` | ⏳ TODO |
| `checkout_started` | Navigate to checkout | `cartTotal`, `itemCount` | ⏳ TODO |
| `purchase_completed` | Submit checkout | `orderId`, `total`, `items` | ⏳ TODO |

## Commands

```bash
pnpm dev      # Start dev server on :5173
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
