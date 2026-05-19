# Orlaf Monorepo

A pnpm + Turborepo monorepo containing all Orlaf apps and shared packages.

## Structure

```
apps/
  backend/       # NestJS API                  → http://localhost:3000
  creator-web/   # TanStack Router + shadcn/ui → http://localhost:3001
  admin-web/     # TanStack Router + shadcn/ui → http://localhost:3002
  mobile/        # Expo (React Native)

packages/
  ui/            # Shared shadcn/ui components
  types/         # Shared TypeScript types
```

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| pnpm | 9+ | `npm install -g pnpm` |
| Docker | any | [docker.com](https://www.docker.com) |
| Expo Go | latest | App Store / Play Store |

---

## Getting Started

### 1. Clone

```bash
git clone git@github.com:your-org/orlaf.git
cd orlaf
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

```bash
cp apps/backend/.env.example apps/backend/.env
```

Fill in the values in `apps/backend/.env`.

### 4. Start the database

```bash
pnpm db:up
```

### 5. Run migrations

```bash
pnpm db:migrate
```

### 6. Start all apps

```bash
pnpm dev
```

| App | URL |
|-----|-----|
| Backend API | http://localhost:3000/api/v1 |
| Creator Web | http://localhost:5173 |
| Admin Web | http://localhost:5174 |
| Mobile | Expo DevTools — scan QR or press `i` / `a` |

---

## Standard Commands

```bash
pnpm dev          # start all apps in parallel
pnpm build        # build all apps
pnpm lint         # lint all apps and packages
pnpm format       # format all apps and packages
pnpm typecheck    # type-check all apps and packages
```

---

## Database Commands

```bash
pnpm db:up        # start Postgres in Docker
pnpm db:stop      # stop Postgres (keeps data)
pnpm db:down      # stop and remove container (keeps volume)
pnpm db:migrate   # run pending migrations
pnpm db:generate  # regenerate Prisma client after schema changes
pnpm db:studio    # open Prisma Studio (DB GUI)
pnpm db:seed      # seed the database
pnpm db:reset     # ⚠️  wipe all data and re-migrate (destructive)
```

---

## Adding UI Components

Run from the repo root, targeting the app you want to add to:

```bash
pnpm dlx shadcn@latest add button -c apps/creator-web
pnpm dlx shadcn@latest add button -c apps/admin-web
```

Components are placed in `packages/ui/src/components` and shared across apps.

Import them via the `ui` package:

```tsx
import { Button } from "@orlaf/ui/components/button";
```

---

## Adding Dependencies

```bash
# Add to a specific app
pnpm --filter @orlaf/backend add @nestjs/jwt
pnpm --filter @orlaf/creator-web add @tanstack/react-router
pnpm --filter @orlaf/mobile add expo-router

# Add to shared packages
pnpm --filter @orlaf/ui add lucide-react

# Add a dev dependency to the root
pnpm add -D -w some-tool
```

---

## Prisma Workflow

```bash
# After editing prisma/schema.prisma:
pnpm db:migrate       # create + apply migration (prompts for a name)
pnpm db:generate      # regenerate client (usually done automatically by migrate)

# Useful during development
pnpm db:studio        # visual DB editor at http://localhost:5555
pnpm db:reset         # ⚠️  wipe and start fresh
```

Inject `PrismaService` into any NestJS service — no need to import `PrismaModule` per feature since it's global:

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }
}
```

---

## Branch Strategy

```
main   → production
dev    → integration (default — open all PRs against dev)
```

Branch naming:

```
feat/backend/user-auth
feat/web/onboarding-flow
feat/mobile/push-notifications
fix/backend/jwt-expiry
chore/update-dependencies
```

Hotfixes branch off `main`, then merge `main` back into `dev`.