# Packages Directory

Monorepo workspace containing all project packages.

## Package Overview

| Package | Purpose | Port |
|---------|---------|------|
| `shared` | Common types, utilities, constants | N/A |
| `shop` | E-commerce storefront | 3000 |
| `tracker` | Embeddable tracking script | N/A (bundled) |
| `backend` | NestJS API server | 4000 |
| `dashboard` | Analytics dashboard | 3001 |

## Dependency Graph

```
shared ◄─── shop
       ◄─── tracker
       ◄─── backend
       ◄─── dashboard
```

All packages depend on `shared`. No other inter-package dependencies.

## Package Structure Convention

Each package follows this structure:

```
packages/<name>/
├── src/
│   ├── index.ts          # Main entry point
│   └── ...
├── package.json
├── tsconfig.json
├── CLAUDE.md             # Package-specific context
└── README.md             # Package documentation
```

## Workspace Commands

Run from package directory or use workspace filters:

```bash
# From root
pnpm --filter <package-name> <command>

# Examples
pnpm --filter @demo/backend dev
pnpm --filter @demo/shop build
pnpm --filter @demo/shared test
```

## Package Naming

All packages use `@flowtel/` scope:
- `@flowtel/shared`
- `@flowtel/shop`
- `@flowtel/tracker`
- `@flowtel/backend`
- `@flowtel/dashboard`

## Adding Dependencies

```bash
# Add to specific package
pnpm --filter @flowtel/backend add nestjs

# Add shared dependency to root
pnpm add -D typescript -w

# Add internal dependency
pnpm --filter @flowtel/shop add @flowtel/shared
```

## Build Order

1. `shared` (must build first - other packages depend on it)
2. `tracker`, `shop`, `dashboard`, `backend` (can build in parallel)

## Type Sharing

Import shared types from `@flowtel/shared`:

```typescript
import { TrackingEvent, Stats, Insight } from '@flowtel/shared';
import { Product, Cart, CartItem } from '@flowtel/shared';
import { EventType } from '@flowtel/shared';
import { products } from '@flowtel/shared';
```
