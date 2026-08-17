export type AuditActionType =
  | "series-published"
  | "series-rejected"
  | "series-unpublished"
  | "series-deleted"
  | "episode-published"
  | "episode-rejected"
  | "creator-verified"
  | "user-suspended"
  | "user-reactivated"
  | "creator-reactivated"
  | "application-approved"
  | "application-rejected"
  | "report-created"
  | "report-reviewed"
  | "report-resolved"
  | "report-dismissed"
  | "rail-created"
  | "rail-updated"
  | "rail-deleted"
  | "member-invited"
  | "member-role-changed"

export type AuditActorRole = "admin"

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

export interface AuditLogListQuery {
  q?: string
  action?: AuditActionType | "all"
  page?: number
  pageSize?: number
}

export interface AuditLogListResponse {
  items: AuditLogEntry[]
  total: number
  page: number
  pageSize: number
}
