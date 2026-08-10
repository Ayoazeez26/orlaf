/**
 * @sable/contracts — admin onboarding
 *
 * Types for the admin-web /onboarding surface: creator application review
 * (approve / reject / reopen) and creator invites (send / resend / revoke).
 */

// ─────────────────────────────────────────────────────────────────────────────
// Applications
// ─────────────────────────────────────────────────────────────────────────────

export type AdminApplicationStatus = "pending" | "approved" | "rejected"

export type AdminApplicationFilter = "all" | AdminApplicationStatus

export interface AdminApplicationListItem {
  id: string
  name: string
  email: string
  username: string
  initials: string
  location: string
  source: string
  /** ISO 8601 submission (account creation) timestamp. */
  submittedAt: string
  status: AdminApplicationStatus
}

export interface AdminApplicationChecklistStep {
  id: string
  label: string
  completed: boolean
}

export interface AdminApplicationDetail extends AdminApplicationListItem {
  bio: string | null
  reviewedAt: string | null
  reviewNote: string | null
  checklist: AdminApplicationChecklistStep[]
}

export interface AdminApplicationListQuery {
  filter?: AdminApplicationFilter
  q?: string
  page?: number
  pageSize?: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Invites
// ─────────────────────────────────────────────────────────────────────────────

/** Mirrors the Prisma InviteStatus enum. */
export type AdminInviteStatus = "sent" | "accepted" | "expired" | "revoked"

export type AdminInviteFilter = "all" | AdminInviteStatus

export interface AdminInviteListItem {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  status: AdminInviteStatus
  sentBy: string
  /** ISO 8601 timestamp of the last send. */
  sentAt: string
  expiresAt: string
}

export interface AdminInviteListQuery {
  filter?: AdminInviteFilter
  q?: string
  page?: number
  pageSize?: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Stats + shared list envelope
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminOnboardingStats {
  pending: number
  invited: number
  approved: number
  rejected: number
}

export interface AdminApplicationListResponse {
  items: AdminApplicationListItem[]
  total: number
  page: number
  pageSize: number
  stats: AdminOnboardingStats
}

export interface AdminInviteListResponse {
  items: AdminInviteListItem[]
  total: number
  page: number
  pageSize: number
  stats: AdminOnboardingStats
}

// ─────────────────────────────────────────────────────────────────────────────
// Requests
// ─────────────────────────────────────────────────────────────────────────────

export interface RejectApplicationRequest {
  note?: string
}

export interface CreateCreatorInviteRequest {
  email: string
  firstName?: string
  lastName?: string
  note?: string
}
