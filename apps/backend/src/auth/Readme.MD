# Auth module

JWT plumbing foundation for all Sable API surfaces. Handles RS256 token issuance and verification. Does not implement any sign-in flow — those live in their own stories.

## Env vars

| Var | Required | Description |
|-----|----------|-------------|
| `JWT_PRIVATE_KEY_BASE64` | Yes | PKCS8 RS256 private key, base64-encoded. **Never commit.** |
| `JWT_PUBLIC_KEY_BASE64` | Yes | SPKI RS256 public key, base64-encoded. Safe to share with verifier-only services. |
| `JWT_ISSUER` | Yes | Token issuer claim. Use the API's public base URL, e.g. `https://api.sable.app`. |
| `JWT_ACCESS_EXPIRES_IN` | Yes | Access token lifetime in **seconds**. Must be `900` (15 min) per architecture spec. |
| `SENTRY_DSN` | No | Stubbed — uncomment Sentry calls once KAN-53 OTEL setup is complete. |

## Key generation

Run once per environment:

```bash
node apps/api/scripts/gen-jwt-keys.mjs
```

Store `JWT_PRIVATE_KEY_BASE64` in your secrets manager (Railway env vars, AWS Secrets Manager, etc). The public key can be distributed to any service that needs to verify tokens without issuing them.

## Usage

### Issuing a token

```ts
import { AuthService } from './auth/auth.service';
import { AccountType, AdminRole } from '@sable/contracts';

// In any sign-in handler after identity is verified:
const token = authService.issueAccessToken({
  account_id: user.id,
  account_type: AccountType.USER,
  role: null,
});
```

### Protecting a route

```ts
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AccessTokenClaims } from '@sable/contracts';

@UseGuards(JwtAuthGuard)
@Get('me')
getMe(@Req() req: Request & { user: AccessTokenClaims }) {
  return req.user;
}
```

## Token shape

```jsonc
{
  "sub": "acc_abc123",         // account_id
  "account_type": "user",      // AccountType enum value
  "role": null,                // AdminRole or null
  "iss": "https://api.sable.app",
  "iat": 1718000000,
  "exp": 1718000900            // iat + 900
}
```

## Observability

- Structured logs emitted for: `access_token_issued`, `access_token_sign_failed`, `jwt_validated`, `jwt_validation_failed`, `jwt_auth_rejected`.
- Sentry capture calls are present but commented out — activate in KAN-53.
- W3C tracecontext propagation points marked with `TODO(KAN-53)` in `jwt-auth.guard.ts`.

## Running tests

```bash
pnpm --filter @sable/api test auth
```

---

## Refresh tokens (KAN-3)

### Additional env vars

| Var | Required | Description |
|-----|----------|-------------|
| `JWT_REFRESH_EXPIRES_IN` | No | Refresh token lifetime in **seconds**. Default `2592000` (30 days). Override per surface for shorter web sessions. |

### Endpoints

#### `POST /auth/refresh`

Rotates the refresh token and issues a new access + refresh pair.

**Mobile** — send `refresh_token` in the body:
```json
{ "refresh_token": "<opaque>", "account_type": "user" }
```
Response:
```json
{ "access_token": "<jwt>", "refresh_token": "<new opaque>" }
```

**Web** — send nothing in the body; token arrives via `sable_rt` httpOnly cookie.
Response sets a new `sable_rt` cookie and returns:
```json
{ "access_token": "<jwt>" }
```

#### `POST /auth/refresh/revoke`

Revokes the token (logout). Mobile sends `{ "refresh_token": "..." }`. Web sends nothing — cookie is used and then cleared.

### Reuse detection

Presenting an already-revoked token triggers chain revocation: every token derived from the stolen root is immediately revoked and a `401` is returned. This limits the blast radius of a stolen refresh token.

### Migration

```bash
pnpm --filter @sable/api prisma migrate dev --name add_refresh_tokens
```

---

## Provider token verification (KAN-4)

Verifies Google and Apple ID tokens before issuing our own JWT. Used by every OAuth sign-in handler.

### Env vars

| Var | Surface | Description |
|-----|---------|-------------|
| `GOOGLE_CLIENT_ID_MOBILE` | Mobile | Google OAuth client ID registered for the iOS/Android app |
| `GOOGLE_CLIENT_ID_WEB` | Creator web | Google OAuth client ID registered for the creator web app |
| `APPLE_SERVICE_ID_MOBILE` | Mobile | Apple service ID / bundle ID for the iOS app |
| `APPLE_SERVICE_ID_WEB` | Creator web | Apple service ID registered for the creator web app |

### Usage

```ts
const claims = await providerTokenService.verifyProviderIdToken({
  provider: OAuthProvider.GOOGLE,
  id_token: idTokenFromClient,
  surface: 'mobile',
});
// claims: { sub, email, email_verified, name?, is_private_email? }
```

### What is verified

**Google:** issuer (`https://accounts.google.com` or `accounts.google.com`), audience (surface-specific client ID), expiry, RS256 signature against Google JWKS.

**Apple:** issuer (`https://appleid.apple.com`), audience (surface-specific service ID), expiry, ES256 signature against Apple JWKS. Private relay emails accepted. Name only present on first sign-in — always persist it when present.

### JWKS caching

Keys are cached using `Cache-Control: max-age` from the provider response (fallback: 1 hour). On a cache miss for a specific `kid`, the cache is busted once and re-fetched — handles key rotation transparently.

---

## Account model (KAN-5)

### Schema

```
accounts
  id                  cuid PK
  account_type        enum: user | creator | admin
  email               string
  email_normalized    string  — lowercased + NFC normalized
  provider            enum: google | apple | null
  provider_subject_id string | null
  password_hash       string | null  — admin only (scrypt salt:hash)
  must_change_password boolean       — admin only
  display_name        string | null
  avatar_url          string | null
  status              enum (see below)
  deleted_at          timestamp | null
  anonymized_at       timestamp | null
  created_at          timestamp
  updated_at          timestamp
```

### Uniqueness rules

- `(account_type, email_normalized)` unique — same email allowed across types, never within the same type
- `(account_type, provider, provider_subject_id)` unique — one OAuth identity per surface

### Allowed status transitions

**User:** `active → pending_deletion → active` (restore) | `pending_deletion → deleted`

**Creator:**
```
onboarding → pending_approval → active → suspended → active
                              → rejected → pending_approval (re-apply)
active → pending_deletion → active (restore) | deleted
```

**Admin:** `active ↔ suspended`

### Migration

```bash
pnpm db:migrate --name add_accounts
```

---

## Logout (KAN-6)

### `POST /auth/logout`

Requires a valid `Authorization: Bearer <access_token>` header.

**Mobile:**
```json
{ "refresh_token": "<opaque>", "logout_all": false }
```

**Web:** empty body — reads `sable_rt` cookie, clears it on response.

**logout_all:** pass `"logout_all": true` to revoke every session across all devices.

**Response:** `204 No Content`

After logout the access token remains valid until its 15-minute expiry — this is by design. No new tokens can be minted from the revoked refresh token. Any attempt to use the revoked token triggers the reuse-detection chain revocation from KAN-3.

---

## Account deletion lifecycle (KAN-7)

### `POST /auth/account/delete`

Requires `Authorization: Bearer <access_token>`. User accounts only — creator/admin tokens return 400 with `error_code: DELETION_NOT_ALLOWED`.

**What happens on call:**
1. `account.status` → `pending_deletion`, `deleted_at` → now
2. All refresh tokens revoked (all sessions terminated)
3. `deletion_jobs` row created with `run_at = now + 30 days`

**Returns:** `204 No Content`

### Grace period restore

When a sign-in during the 30-day grace period matches a `pending_deletion` account, the sign-in handler must call `DeletionService.restoreAccountIfPendingDeletion(accountId)`. If it returns `{ restored: true }`, include `account_restored: true` in the sign-in response so the mobile client can show a banner.

### Anonymization job

Runs daily at 03:00 UTC (`EVERY_DAY_AT_3AM`). Processes all `deletion_jobs` with `run_at` in the past.

For each account:
- `email` and `email_normalized` → `deleted+<id>@deleted.local`
- `display_name`, `provider_subject_id`, `avatar_url`, `password_hash` → null
- `status` → `deleted`, `anonymized_at` → now
- `deletion_jobs` row removed

The original email is now free for re-signup. Foreign key references from `comments`, `watch_history`, and `favorites` remain intact — consuming services show "Deleted user" when `status = deleted`.

### Contract for consuming services

```ts
// When joining accounts for display:
const displayName = account.status === 'deleted' ? 'Deleted user' : account.display_name;
```

### Migration

```bash
pnpm db:migrate --name add_deletion_jobs
```

### Install required package

```bash
pnpm --filter @orlaf/backend add @nestjs/schedule
```

---

## OAuth sign-in endpoints (KAN-8)

### `POST /auth/sign-in/google`

```json
{
  "id_token": "<Google ID token from SDK>",
  "surface": "mobile" | "creator-web",
  "device_label": "iPhone 15 Pro"
}
```

### `POST /auth/sign-in/apple`

```json
{
  "id_token": "<Apple identity token from SDK>",
  "surface": "mobile" | "creator-web",
  "device_label": "iPhone 15 Pro",
  "name": { "given_name": "Jane", "family_name": "Doe" },
  "is_private_email": true
}
```

### Success response `200`

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<opaque>",
  "account_type": "user" | "creator",
  "account_state": "active" | "pending_approval" | "suspended" | "rejected" | "pending_deletion",
  "display_name": "Jane Doe" | null,
  "needs_consent": false,
  "account_restored": false
}
```

`refresh_token` is in the body for `mobile`. For `creator-web` it is set as `sable_rt` httpOnly cookie and omitted from the body.

### Error codes the client must handle

| HTTP | `error_code` | Meaning |
|------|-------------|---------|
| 401 | `VERIFICATION_FAILED` | Provider token invalid, expired, or wrong audience. `provider_error_code` gives specifics. |
| 409 | `email_already_registered_with_other_provider` | Email exists under a different provider. Response includes `provider` field naming it. |

### Surface → account type mapping

| Surface | account_type | Initial status |
|---------|-------------|----------------|
| `mobile` | `user` | `active` |
| `creator-web` | `creator` | `onboarding` |

---

## Consent (KAN-9)

### `GET /auth/policies` — public, no auth

Returns current policy version IDs:

```json
{
  "terms": "1.0.0",
  "privacy": "1.0.0",
  "community_guidelines": "1.0.0",
  "payment": "1.0.0"
}
```

Update `src/auth/policies.config.ts` when any policy document changes.

### `POST /auth/users/consent`

Requires `Authorization: Bearer <access_token>` (user accounts only).

```json
{
  "accepted": true,
  "policyVersions": {
    "terms": "1.0.0",
    "privacy": "1.0.0",
    "community_guidelines": "1.0.0",
    "payment": "1.0.0"
  }
}
```

Returns `204 No Content`. Inserts an immutable `consent_records` row and flips `needs_consent` to `false` on the account.

### Consent gate

Any feature endpoint protected by both `JwtAuthGuard` and `ConsentGuard` returns:

```json
{ "error_code": "consent_required" }
```

with HTTP `403` if `needs_consent` is still `true`. Mobile/web clients route the user back to the consent screen on this error code.

Apply both guards to feature routes:

```ts
@UseGuards(JwtAuthGuard, ConsentGuard)
@Get('feed')
getFeed() { ... }
```

Exempt a route from the gate:

```ts
@SkipConsent()
@Get('public-stuff')
getPublicStuff() { ... }
```

### Migration

```bash
pnpm db:migrate --name add_consent_records
```