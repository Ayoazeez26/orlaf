import type {
  ModerationReportStatus,
  ModerationSeverity,
  ProjectPublishStatus,
  ProjectReviewStatus,
} from "./types"

export type ProjectFilter = "all" | "pending-review" | "rejected"

export const PROJECT_FILTERS: { key: ProjectFilter; label: string }[] = [
  { key: "all", label: "All series" },
  { key: "pending-review", label: "Pending review" },
  { key: "rejected", label: "Rejected" },
]

export const PUBLISH_STATUS_BADGE_CLASS: Record<ProjectPublishStatus, string> =
  {
    published: "bg-primary/10 text-primary",
    draft: "bg-muted text-muted-foreground",
  }

export const PUBLISH_STATUS_LABEL: Record<ProjectPublishStatus, string> = {
  published: "published",
  draft: "draft",
}

export const REVIEW_STATUS_BADGE_CLASS: Record<ProjectReviewStatus, string> = {
  approved: "bg-emerald-500/10 text-emerald-600",
  pending: "bg-amber-500/10 text-amber-600",
  rejected: "bg-red-500/10 text-red-600",
}

export const REVIEW_STATUS_LABEL: Record<ProjectReviewStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
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
  pending: "bg-red-500 text-white",
  reviewed: "bg-primary text-white",
  resolved: "bg-emerald-600 text-white",
  dismissed: "bg-muted text-muted-foreground",
}
