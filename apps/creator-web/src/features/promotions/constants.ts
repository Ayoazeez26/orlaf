import type { PromotionStatusFilter } from "./types"

export const PROMOTION_STATUS_FILTER_PILLS: {
  value: PromotionStatusFilter
  label: string
}[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "draft", label: "Draft" },
]

export const PROMOTION_PLACEMENT_OPTIONS = [
  { value: "home_banner", label: "Home banner" },
  { value: "series_page", label: "Series page" },
  { value: "player_preroll", label: "Player preroll" },
] as const

export const PROMOTION_AUDIENCE_OPTIONS = [
  { value: "all_viewers", label: "All viewers" },
  { value: "subscribers", label: "Subscribers" },
  { value: "new_viewers", label: "New viewers" },
] as const

export const PROMOTION_GOAL_OPTIONS = [
  {
    value: "views" as const,
    label: "Views",
    description: "Maximize impressions",
  },
  {
    value: "subscribers" as const,
    label: "Subscribers",
    description: "Grow your audience",
  },
  {
    value: "watch_time" as const,
    label: "Watch time",
    description: "Increase engagement",
  },
]

export const PROMOTION_FORM_PROJECTS = [
  { id: "lagos-after-dark", name: "Lagos After Dark" },
  { id: "lagos-nights", name: "Lagos Nights" },
  { id: "studio-sessions", name: "Studio Sessions" },
]

export function promotionDetailPath(promotionId: string) {
  return {
    to: "/dashboard/promotions/$promotionId" as const,
    params: { promotionId },
  }
}

export const DEFAULT_ESTIMATED_REACH = {
  impressions: "31.3k",
  uniqueReach: "16.3k–24.4k",
  clicks: "2.0k",
  footnote:
    "Based on a $8 CPM for home banner and all viewers. Actual results vary with creative and timing.",
}
