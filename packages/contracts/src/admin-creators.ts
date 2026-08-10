/**
 * @sable/contracts — admin creators management
 *
 * Types for the admin-web /creators surface: list, detail, verify, suspend,
 * reactivate. Consumed by the API (NestJS) and admin-web.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────────────────────

/** Creator statuses surfaced in the admin creators list. */
export type AdminCreatorStatus = "active" | "suspended"

export type AdminSuspendDuration = "24h" | "7d" | "30d" | "permanent"

export const ADMIN_SUSPEND_DURATIONS: AdminSuspendDuration[] = [
  "24h",
  "7d",
  "30d",
  "permanent",
]

// ─────────────────────────────────────────────────────────────────────────────
// List
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminCreatorListItem {
  id: string
  name: string
  email: string
  /** Creator handle prefixed with "@", or empty string when unset. */
  username: string
  initials: string
  location: string
  /** Lifetime views. 0 until analytics is wired (Phase 2). */
  views: number
  /** Lifetime earnings in USD. 0 until payouts is wired (Phase 2). */
  earnings: number
  status: AdminCreatorStatus
  isVerified: boolean
  /** Account created within the current calendar month. */
  isNew: boolean
  /** ISO 8601 account creation timestamp. */
  joinedAt: string
}

export interface AdminCreatorStats {
  total: number
  active: number
  suspended: number
  newThisMonth: number
}

export interface AdminCreatorListResponse {
  items: AdminCreatorListItem[]
  total: number
  page: number
  pageSize: number
  stats: AdminCreatorStats
}

export type AdminCreatorListFilter = "all" | "active" | "suspended" | "new"

export interface AdminCreatorListQuery {
  filter?: AdminCreatorListFilter
  q?: string
  page?: number
  pageSize?: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Detail
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminCreatorDetail extends AdminCreatorListItem {
  bio: string | null
  handle: string | null
  studioName: string | null
  creatorType: string | null
  verifiedAt: string | null
  suspendedAt: string | null
  suspendedUntil: string | null
  suspendReason: string | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminSuspendCreatorRequest {
  duration: AdminSuspendDuration
  reason?: string
}

export interface AdminVerifyCreatorRequest {
  note?: string
}
