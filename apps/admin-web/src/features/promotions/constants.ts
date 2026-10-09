import type { PromotionGoal } from "@sable/contracts"
import { PROMOTION_PLACEMENT_LABELS } from "@sable/contracts"
import type { PromotionFilter, PromotionStatus } from "./types"

export { PROMOTION_PLACEMENT_LABELS }

export const PROMOTION_GOAL_LABELS: Record<PromotionGoal, string> = {
  views: "Views",
  subscribers: "Subscribers",
  watch_time: "Watch time",
}

export const PROMOTION_FILTERS: { key: PromotionFilter; label: string }[] = [
  { key: "all", label: "All Campaigns" },
  { key: "pending", label: "Pending" },
  { key: "live", label: "Live" },
  { key: "paused", label: "Paused" },
  { key: "rejected", label: "Rejected" },
  { key: "ended", label: "Ended" },
]

export const PROMOTION_STATUS_LABEL: Record<PromotionStatus, string> = {
  pending: "Pending",
  live: "Live",
  paused: "Paused",
  rejected: "Rejected",
  ended: "Ended",
}

export const PROMOTION_STATUS_BADGE_CLASS: Record<PromotionStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  live: "bg-emerald-500/10 text-emerald-600",
  paused: "bg-primary/10 text-primary",
  rejected: "bg-red-500/10 text-red-600",
  ended: "bg-muted text-muted-foreground",
}

export const PROMOTION_TIME_RANGES = [
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "This year",
] as const
