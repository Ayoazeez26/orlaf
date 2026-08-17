import type {
  ModerationContentType,
  ModerationReportStatus,
  ModerationSeverity,
} from "./types"

export type ModerationFilter = "all" | "pending" | "reviewed" | "resolved"

export const MODERATION_FILTERS: { key: ModerationFilter; label: string }[] = [
  { key: "all", label: "All reports" },
  { key: "pending", label: "Pending" },
  { key: "reviewed", label: "Reviewed" },
  { key: "resolved", label: "Resolved" },
]

export const CONTENT_TYPE_LABEL: Record<ModerationContentType, string> = {
  episode: "Episode",
  video: "Video",
  "user-profile": "User profile",
}

export const SEVERITY_BADGE_CLASS: Record<ModerationSeverity, string> = {
  high: "bg-red-500/10 text-red-600",
  medium: "bg-amber-500/10 text-amber-600",
  low: "bg-muted text-muted-foreground",
}

export const MODERATION_STATUS_BADGE_CLASS: Record<
  ModerationReportStatus,
  string
> = {
  pending: "bg-red-500/10 text-red-600",
  reviewed: "bg-primary/10 text-primary",
  resolved: "bg-emerald-500/10 text-emerald-600",
  dismissed: "bg-muted text-muted-foreground",
}
