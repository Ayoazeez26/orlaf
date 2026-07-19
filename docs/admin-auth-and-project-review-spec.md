# Admin Auth + Project Management — Implementation Spec

Status: Draft (decisions locked)
Scope: Super admin auth (seed → sign-in → invite → assign role) and admin project/series management.
Out of scope (deferred): Creator onboarding application queue, discovery, monetization, moderation reports.

---

## 1. Goals

1. Replace the admin-web demo role picker with real authentication.
2. Bootstrap the platform with a single seeded super admin.
3. Let the super admin invite other admins and assign them a role.
4. Enforce role-based access on the backend (not just UI nav config).
5. Let admins list all creator projects/series and toggle visibility on mobile (publish / unpublish / reject).

### Product decision: no review gate before mobile (DECIDED)

Creators should **not** wait in `in_review` before content appears on mobile. When a creator publishes, the series goes straight to `published`.

Admins retain oversight: they can browse all series and **toggle status later** (unpublish, republish, reject/takedown). Review-before-publish is deferred — not removed from the schema, just not used in the live path for now.

---

## 2. Canonical role model (DECIDED)

Use the 5 workspace roles already present in admin-web routing. The invite dialog and backend contracts are brought in line with these.

| Role | Value | Responsibilities (from existing nav config) |
|------|-------|---------------------------------------------|
| Super Admin | `super_admin` | Full oversight. **Only role that manages the team / invites.** |
| Content Admin | `content_admin` | Creators, onboarding, projects, discovery, moderation |
| Marketing Admin | `marketing_admin` | Promotions, discovery, campaign analytics |
| Finance Admin | `finance_admin` | Coin economy, payouts, revenue split, subscriptions |
| Support Admin | `support_admin` | Support tickets, onboarding, moderation triage |

### Changes required

- `packages/contracts/src/auth.ts` — replace `AdminRole` (`super_admin`, `clan_admin`) with the 5 values above.
- `apps/admin-web/src/features/settings/constants.ts` — `TEAM_ROLE_OPTIONS` currently lists `admin`, `moderator`, `finance-admin`, `analyst`. Replace with `content-admin`, `marketing-admin`, `finance-admin`, `support-admin` (super-admin is not invitable). Update `TEAM_ROLE_LABEL` / `TEAM_ROLE_BADGE_CLASS` accordingly.
- Standardize on underscore form (`content_admin`) in JWT/DB/contracts; admin-web URL segments use hyphen form (`content-admin`). Add a single mapping helper (`roleToWorkspaceId` / `workspaceIdToRole`).

### Permission source of truth

Each role's allowed sections already exist in `apps/admin-web/src/features/workspaces/data/roles/*.ts` (consumed by `roleHasNavAccess`). Backend authorization should mirror this matrix. Extract it into a shared map so front and back agree.

---

## 3. Super admin bootstrap (DECIDED: seed script)

Idempotent seed script, credentials from env.

- Command: `pnpm --filter @orlaf/backend seed:superadmin`
- Env: `SUPERADMIN_EMAIL`, `SUPERADMIN_PASSWORD` (optional — if omitted, generate a random temp password and print it once).
- Behavior:
  - If an admin with that normalized email already exists → no-op (log and exit 0).
  - Else create `account_type=admin`, `role=super_admin`, `status=active`, `must_change_password=true`.
- Reuses `AccountService.createAdmin()` after that method is fixed to persist `role` (see §5).

---

## 4. Data model changes (Prisma)

### 4.1 Account — persist admin role

Add to `Account` in `apps/backend/prisma/schema.prisma`:

```prisma
adminRole AdminRole? @map("admin_role")   // null for user/creator, set for admin
```

```prisma
enum AdminRole {
  super_admin
  content_admin
  marketing_admin
  finance_admin
  support_admin
  @@map("admin_role")
}
```

### 4.2 AdminInvite — invite + role assignment

```prisma
model AdminInvite {
  id              String       @id @default(cuid())
  email           String
  emailNormalized String       @map("email_normalized")
  role            AdminRole
  token           String       @unique
  status          InviteStatus @default(sent)
  invitedById     String       @map("invited_by_id")
  invitedBy       Account      @relation("AdminInvitesSent", fields: [invitedById], references: [id])
  acceptedAt      DateTime?    @map("accepted_at")
  expiresAt       DateTime     @map("expires_at")
  createdAt       DateTime     @default(now()) @map("created_at")

  @@index([emailNormalized])
  @@map("admin_invites")
}

enum InviteStatus {
  sent
  accepted
  expired
  revoked
  @@map("invite_status")
}
```

### 4.3 Series — admin action metadata (optional audit)

No review-queue fields required for v1. Add lightweight audit fields for admin takedowns:

```prisma
adminActionById   String?   @map("admin_action_by_id")
adminActionAt     DateTime? @map("admin_action_at")
adminActionNote   String?   @map("admin_action_note")   // e.g. rejection / unpublish reason
```

`in_review` and `rejected` remain in the `SeriesStatus` enum for future use; the live creator publish path skips `in_review`.

Migration name suggestion: `add_admin_roles_invites_series_admin_actions`.

---

## 5. Backend — auth

### 5.1 Fix `AccountService.createAdmin()`
`apps/backend/src/auth/account.service.ts` — currently destructures `role` but never persists it. Write `adminRole: input.role` into the create call.

### 5.2 Admin sign-in
`POST /api/v1/auth/sign-in/admin`

- Body: `AdminSignInRequest { email, password }` (already in contracts).
- Verify `account_type === admin`, status `active`, password via `AccountService.verifyPassword()`.
- Issue access token with `role = account.adminRole`.
- Issue refresh token (admin surface).
- Response: extend `AdminSignInResponse` with `must_change_password: boolean` and `role: AdminRole`.
- When `must_change_password === true`, client routes to forced password change before dashboard.

### 5.3 Forced password change
`POST /api/v1/auth/admin/password` (guarded)

- Body: `AdminPasswordChangeRequest { currentPassword, newPassword }`.
- Verify current password, set new hash, set `must_change_password=false`.

### 5.4 Role on token issuance + refresh (BUG FIX)
- Admin sign-in passes the real `role` to `AuthService.issueAccessToken()`.
- `POST /auth/refresh` currently hardcodes `role: null`. For admin accounts, **re-read `adminRole` from DB** on every refresh and include it in the new access token. Correctness after role changes matters more than saving one query.

### 5.5 Guards
- `AdminAuthGuard` — extends JWT auth, asserts `account_type === admin`.
- `RolesGuard` + `@Roles(...AdminRole[])` decorator — checks `req.user.role`.
- Super admin may access any workspace section; other roles checked against the permission matrix.

---

## 6. Backend — team management (super admin only)

New `AdminModule` with `AdminTeamController`.

| Method | Route | Guard | Purpose |
|--------|-------|-------|---------|
| GET | `/api/v1/admin/team` | admin | List admin members (+ role, status) |
| POST | `/api/v1/admin/team/invite` | super_admin | Create admin account + `AdminInvite`, email temp password |
| POST | `/api/v1/admin/team/invite/:id/resend` | super_admin | Resend invite |
| POST | `/api/v1/admin/team/invite/:id/revoke` | super_admin | Revoke pending invite |
| PATCH | `/api/v1/admin/team/:accountId/role` | super_admin | Reassign role |
| POST | `/api/v1/admin/team/:accountId/suspend` | super_admin | Suspend (`active → suspended`) |
| POST | `/api/v1/admin/team/:accountId/activate` | super_admin | Reactivate (`suspended → active`) |

Rules:
- Super admin cannot be deleted; cannot suspend the last remaining super admin.
- Invite creates the admin account immediately with `must_change_password=true` and the assigned role, plus an `AdminInvite` row for tracking/resend.

Contracts to add in `packages/contracts/src/admin.ts`:
`AdminTeamMember`, `InviteAdminRequest`, `AdminInvite`, `UpdateAdminRoleRequest`.

---

## 7. Backend — creator publish (always live)

### Current behavior (to change)

`series.service.ts` `publish()` branches on `autoPublishAfterProcessing`:

```ts
const status = prefs.autoPublishAfterProcessing ? "published" : "in_review"
```

### New behavior (DECIDED)

**Always publish immediately** when the creator hits publish (all episodes ready):

```ts
const status = "published"
```

- Set `publishedAt` on first publish.
- Log `series_published` (drop `series_submitted_for_review` from the live path).
- `autoPublishAfterProcessing` preference can remain in schema but is ignored for now, or default it to `true` everywhere. Do not route to `in_review`.

### Public / mobile visibility (DECIDED)

- Public catalog (`studio-public`, library, watchlist): **`published` only**.
- Remove `in_review` from public queries in `series.service.ts` and `library.service.ts`. This was previously intentional (review content still visible); product direction has changed — creators go live immediately, admins pull down if needed.
- `draft`, `rejected`, `archived` are never public.

---

## 8. Backend — admin project/series management

Admins get a cross-creator view of all series and can toggle status. This replaces a mandatory review queue.

New `AdminSeriesController` (in `AdminModule`).

| Method | Route | Guard | Purpose |
|--------|-------|-------|---------|
| GET | `/api/v1/admin/series?status=&search=&page=` | super_admin, content_admin | List all series (all creators), filter by status |
| GET | `/api/v1/admin/series/:id` | super_admin, content_admin | Detail: episodes, creator, stats |
| POST | `/api/v1/admin/series/:id/unpublish` | super_admin, content_admin | `published → draft`, clear from mobile. Sets `adminActionBy/At/Note`. |
| POST | `/api/v1/admin/series/:id/publish` | super_admin, content_admin | `draft \| rejected → published`, back on mobile |
| POST | `/api/v1/admin/series/:id/reject` | super_admin, content_admin | `published \| draft → rejected`, takedown with reason |
| POST | `/api/v1/admin/series/:id/archive` | super_admin, content_admin | `* → archived` (soft remove) |

### Status transitions (admin)

| From | Action | To | Mobile visible? |
|------|--------|-----|-----------------|
| `draft` | creator publishes | `published` | Yes |
| `published` | admin unpublish | `draft` | No |
| `published` | admin reject | `rejected` | No |
| `draft` | admin publish | `published` | Yes |
| `rejected` | admin publish | `published` | Yes |
| any | admin archive | `archived` | No |

`in_review` is unused in the live path. If legacy rows exist, admin can publish or reject them via the same endpoints.

### Mapping to admin-web UI

The mock UI has `reviewStatus: approved | pending | rejected`. Map from `Series.status`:

| Series.status | UI `reviewStatus` | UI `status` badge |
|---------------|-------------------|-------------------|
| `published` | `approved` | published |
| `draft` | `approved` (live path skipped review; draft = creator hasn't published or admin unpublished) | draft |
| `rejected` | `rejected` | draft |
| `in_review` (legacy) | `pending` | draft |
| `archived` | `approved` | archived |

**UI changes for v1 wiring:**
- Primary admin actions on detail: **Unpublish**, **Publish**, **Reject** (matches `project-detail-header.tsx` buttons).
- Deprioritize the approve/reject review flow on the list table — show status filters (`all`, `published`, `draft`, `rejected`) instead of `pending-review` as the default tab.
- Stat cards: Total / Published / Draft / Rejected (not Pending review).

Contracts to add: `AdminSeriesListItem`, `AdminSeriesDetail`, `AdminSeriesActionRequest { note?: string }`.

---

## 9. admin-web wiring

Mirror the creator-web pattern.

### 9.1 Infra
- `src/lib/api-base-url.ts` + `src/lib/http-client.ts` — copy/adapt from creator-web.
- Add `@tanstack/react-query` for list/detail caching.
- Auth context: session (`AdminSignInResponse`), `useAuth()`.

### 9.2 Auth routing
- `/login` → `POST /auth/sign-in/admin`.
- Forced password change when `must_change_password`.
- `/` requires auth; redirect to workspace for signed-in role. No demo picker.
- `beforeLoad` on `/workspace/$role/*` verifies session + role access.
- Real sign-out → `POST /auth/logout`.
- Replace `DEMO_USER` with live session.

### 9.3 Feature wiring
- **Team:** settings team tab + invite/edit dialogs → real API. Fix role options to 5-role model.
- **Projects:** list from `GET /admin/series`, detail from `GET /admin/series/:id`, Unpublish/Publish/Reject → admin action endpoints.

---

## 10. Story / ticket breakdown

| # | Story | Deliverable |
|---|-------|-------------|
| 1 | Role model + schema | Expand `AdminRole` to 5, add `adminRole`, `AdminInvite`, series admin-action fields, migration |
| 2 | Super admin seed | Idempotent `seed:superadmin`; fix `createAdmin` to persist role |
| 3 | Admin sign-in + password change + guards | `/auth/sign-in/admin`, `/auth/admin/password`, guards, refresh role fix |
| 4 | admin-web auth slice | http-client, auth context, login, replace picker, sign-out |
| 5 | Team invite / assign role | Team endpoints + admin-web team wiring |
| 6 | Publish-first + admin series mgmt | Creator always publishes; public API `published`-only; `/admin/series` list + toggle endpoints; admin-web projects wiring |

Stories 1–5: auth + bootstrap + invite flow.
Story 6: project visibility (publish immediately, admin toggles later).

Deferred: creator onboarding application queue.

---

## 11. Locked decisions (formerly open questions)

### 11.1 Invite delivery → **temp password email (v1)**

Send the generated temp password via Resend on invite. `createAdmin()` already generates one; email module exists. Simpler than a magic-link flow for v1. Upgrade to set-password link in a follow-up if needed.

Invite email contains: welcome, assigned role, temp password, link to admin login URL, note that password change is required on first sign-in.

### 11.2 Who manages projects → **super_admin + content_admin**

Both roles get `/admin/series` access. Matches the nav config (content-admin has Projects; super-admin has everything). Finance/marketing/support admins do not.

### 11.3 Role on token refresh → **re-read from DB**

On every `POST /auth/refresh`, load `account.adminRole` and embed it in the new access token. Ensures a role change takes effect within one refresh cycle (≤15 min) without forcing re-login.

### 11.4 Review-before-publish → **off for now; publish-first**

Creators publish straight to `published`. Admins browse all series and toggle visibility (unpublish / publish / reject / archive). `in_review` is not used in the live creator path. Public APIs serve `published` only.

This supersedes the earlier spec section that treated `in_review` visibility as a bug and built an approve/reject review queue as the primary flow.
