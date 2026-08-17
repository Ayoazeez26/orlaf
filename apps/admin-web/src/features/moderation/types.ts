export type ModerationContentType = "episode" | "video" | "user-profile"

export type ModerationReportType = "content" | "user"

export type ModerationSeverity = "high" | "medium" | "low"

export type ModerationReportStatus =
  | "pending"
  | "reviewed"
  | "resolved"
  | "dismissed"

export interface ModerationReport {
  id: string
  title: string
  contentType: ModerationContentType
  reportType: ModerationReportType
  parent?: string | null
  severity: ModerationSeverity
  reason: string
  status: ModerationReportStatus
  reported: string
}

export interface ModerationActivityEntry {
  id: string
  label: string
  timestamp: string
}

export interface ModerationReportDetail extends ModerationReport {
  reporterNote: string
  projectId?: string | null
  creatorId?: string | null
  creatorName?: string | null
  activity: ModerationActivityEntry[]
}
