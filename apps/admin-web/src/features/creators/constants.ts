import type { CreatorProjectStatus, CreatorStatus } from "./types"

export type CreatorFilter = "all" | "active" | "suspended" | "new"

export const CREATOR_FILTERS: { key: CreatorFilter; label: string }[] = [
  { key: "all", label: "All creators" },
  { key: "active", label: "Active" },
  { key: "suspended", label: "Suspended" },
  { key: "new", label: "New" },
]

export type CreatorProjectFilter =
  | "all"
  | "published"
  | "in-review"
  | "draft"
  | "scheduled"

export const CREATOR_PROJECT_FILTERS: {
  key: CreatorProjectFilter
  label: string
}[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "in-review", label: "In review" },
  { key: "draft", label: "Draft" },
  { key: "scheduled", label: "Scheduled" },
]

export const CREATOR_STATUS_BADGE_CLASS: Record<CreatorStatus, string> = {
  active: "bg-primary/10 text-primary",
  suspended: "bg-red-500/10 text-red-600",
}

export const PROJECT_STATUS_BADGE_CLASS: Record<CreatorProjectStatus, string> =
  {
    published: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    "in-review": "bg-amber-500/10 text-amber-600",
    draft: "bg-muted text-muted-foreground",
    scheduled: "bg-indigo-500/10 text-indigo-600",
  }

export const PROJECT_STATUS_LABEL: Record<CreatorProjectStatus, string> = {
  published: "Published",
  "in-review": "In review",
  draft: "Draft",
  scheduled: "Scheduled",
}
