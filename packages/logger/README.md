# @sable/contracts

> **Single source of truth** for every API request and response type in the Sable platform.  
> All apps — `backend`, `creator-web`, `admin-web`, and `mobile` — import from this package.  
> If the backend changes a shape, TypeScript catches the drift at compile time across every consumer.

---

## Structure

```
packages/contracts/
├── src/
│   ├── index.ts      ← public barrel (import from here)
│   ├── auth.ts       ← auth epic types
│   └── errors.ts     ← error code unions & ApiErrorResponse envelope
├── dist/             ← tsc output (git-ignored, generated on build)
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

---

## Using the package

All four apps already declare `@sable/contracts` as a dependency via the pnpm workspace protocol. Just import:

```ts
import type {
  SignInGoogleRequest,
  SignInResponse,
  ApiErrorResponse,
  ConsentRequiredErrorCode,
} from "@sable/contracts";
```

---

## Building

```bash
# From repo root — builds contracts (and its dependents) via Turborepo
pnpm build --filter @sable/contracts

# Or directly inside the package
cd packages/contracts
pnpm build
```

The `dist/` folder is produced by `tsc`. It is **git-ignored** and regenerated on every build.

---

## Adding new types

Follow these steps whenever you add a new endpoint:

### 1. Decide which file (or create a new one)

| Domain | File |
|--------|------|
| Auth flows | `src/auth.ts` |
| Error codes / envelopes | `src/errors.ts` |
| New domain (e.g. projects) | `src/projects.ts` |

### 2. Write the types

Use plain TypeScript interfaces. Keep request and response types together, grouped by endpoint.

```ts
// src/projects.ts

/** POST /projects */
export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface CreateProjectResponse {
  id: string;
  name: string;
  createdAt: string; // ISO 8601
}
```

**Conventions:**
- `*Request` suffix for request bodies.
- `*Response` suffix for success response bodies.
- Use `string` for dates (ISO 8601); avoid `Date` — it doesn't serialise over the wire.
- Add a JSDoc comment above each interface noting the HTTP method + path.
- For new error codes, add a union type in `src/errors.ts` and include it in `AnyAuthErrorCode` (or a new domain union).

### 3. Export from the barrel

Open `src/index.ts` and add:

```ts
export * from "./projects";
```

### 4. Build and verify

```bash
pnpm build --filter @sable/contracts
```

TypeScript will catch any consumers that are now out of sync.

### 5. Bump the version (if needed)

This package is private and consumed only within the monorepo, so version bumps are optional. Bump when making breaking changes to aid git-blame readability.

---

## Naming conventions cheat-sheet

| Pattern | Example |
|---------|---------|
| Request body | `CreateProjectRequest` |
| Success response body | `CreateProjectResponse` |
| Error code union (by HTTP status reason) | `RateLimitedErrorCode` |
| Shared sub-type | `UserRole`, `ProjectStatus` |
| Generic error envelope | `ApiErrorResponse<TCode>` |

---

## FAQ

**Q: Should I add Zod schemas here?**  
A: Not yet. The package is TypeScript-only to keep the zero-dependency footprint. If request validation via Zod is needed on the backend, the backend can define its own Zod schemas and `z.infer<>` them against the types here to catch drift at the type level.

**Q: Can I import a sub-path like `@sable/contracts/auth`?**  
A: No. Always import from `@sable/contracts`. The barrel is the public API; internal file layout may change.

**Q: The `dist/` folder is missing — build fails.**  
A: Run `pnpm build --filter @sable/contracts` from the repo root before running any dependent app.