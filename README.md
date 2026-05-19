# Orlaf Monorepo

A pnpm monorepo containing the web, mobile, and backend apps for Orlaf.

## Structure

```
apps/
  backend/       # NestJS API
  web/           # TanStack Router (React)
  mobile/        # Expo (React Native)
packages/
  ui/            # Shared UI components
  types/         # Shared TypeScript types
  config/        # Shared configs (tsconfig, eslint)
```

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) v8+ — `npm install -g pnpm`
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- iOS Simulator (Mac only) or Android Studio for mobile dev

## Getting Started

### 1. Clone the repo

```bash
git clone git@github:clan-productions/orlaf-monorepo.git
cd orlaf-monorepo
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/web/.env.example apps/web/.env
```

Fill in the required values in each `.env` file.

## Running the Apps

Each app can be run individually from the root using pnpm filters.

### Backend (NestJS)

```bash
pnpm --filter backend dev
```

Runs on `http://localhost:3000` by default.

### Web (TanStack Router)

```bash
pnpm --filter web dev
```

Runs on `http://localhost:5173` by default.

### Mobile (Expo)

```bash
pnpm --filter mobile start
```

Then press:
- `i` — open iOS Simulator
- `a` — open Android Emulator
- `w` — open in browser
- Scan the QR code with the Expo Go app on your device

### Run everything at once

```bash
pnpm dev
```

> Requires a `dev` script in the root `package.json` that runs all apps concurrently.

## Useful Commands

```bash
# Install a dependency in a specific app
pnpm --filter backend add @nestjs/jwt

# Install a shared package dep
pnpm --filter web add @orlaf/types

# Run tests across all apps
pnpm test

# Build all apps
pnpm build
```