export type AuditActionType =
  | "series-created"
  | "payout-approved"
  | "user-suspended"
  | "episode-deleted"
  | "episode-published"
  | "content-flagged"
  | "settings-changed"
  | "report-resolved"

export type AuditActorRole = "creator" | "admin" | "viewer"

export type AuditActionFilter = "all" | AuditActionType

export type AuditRoleFilter = "all" | AuditActorRole

export interface AuditLogEntry {
  id: string
  userName: string
  userEmail: string
  userInitials: string
  action: AuditActionType
  target: string
  role: AuditActorRole
  time: string
}
