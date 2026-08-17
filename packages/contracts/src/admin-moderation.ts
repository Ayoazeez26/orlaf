export type ModerationTargetType = "series" | "episode" | "account"
export type ModerationReportStatus =
  | "pending"
  | "reviewed"
  | "resolved"
  | "dismissed"
export type ModerationSeverity = "high" | "medium" | "low"
export type ModerationListFilter =
  | "all"
  | "pending"
  | "reviewed"
  | "resolved"

export interface ModerationReportListItem {
  id: string
  title: string
  contentType: "episode" | "video" | "user-profile"
  reportType: "content" | "user"
  parent: string | null
  severity: ModerationSeverity
  reason: string
  status: ModerationReportStatus
  reported: string
  seriesId: string | null
  creatorId: string | null
}

export interface ModerationActivityEntry {
  id: string
  label: string
  timestamp: string
}

export interface ModerationReportDetail extends ModerationReportListItem {
  reporterNote: string
  projectId: string | null
  creatorName: string | null
  activity: ModerationActivityEntry[]
}

export interface ModerationStats {
  total: number
  pending: number
  reviewed: number
  resolved: number
}

export interface ModerationListQuery {
  filter?: ModerationListFilter
  q?: string
  seriesId?: string
  page?: number
  pageSize?: number
}

export interface ModerationListResponse {
  items: ModerationReportListItem[]
  total: number
  page: number
  pageSize: number
  stats: ModerationStats
}

export interface CreateModerationReportRequest {
  targetType: ModerationTargetType
  targetId: string
  reason: string
  reporterNote?: string
  severity?: ModerationSeverity
}

export interface UpdateModerationReportRequest {
  status: "reviewed" | "resolved" | "dismissed" | "pending"
}
