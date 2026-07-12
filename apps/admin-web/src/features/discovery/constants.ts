import type { DiscoverySurface, RailAudience, RailStatus } from "./types"

export const SURFACE_LABEL: Record<DiscoverySurface, string> = {
  home: "Home / Discover",
  "for-you": "For You",
}

export const RAIL_STATUS_BADGE_CLASS: Record<RailStatus, string> = {
  live: "bg-emerald-500/10 text-emerald-600",
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-primary/10 text-primary",
}

export const RAIL_STATUS_LABEL: Record<RailStatus, string> = {
  live: "Live",
  draft: "Draft",
  scheduled: "Scheduled",
}

export const RAIL_AUDIENCE_LABEL: Record<RailAudience, string> = {
  "all-users": "All users",
  "new-users": "New users",
}

export const RAIL_TYPE_OPTIONS = [
  { value: "rail", label: "Rail (carousel)" },
  { value: "hero", label: "Hero (featured)" },
] as const

export const RAIL_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "live", label: "Live" },
  { value: "scheduled", label: "Scheduled" },
] as const

export const RAIL_AUDIENCE_OPTIONS = [
  { value: "all-users", label: "All users" },
  { value: "new-users", label: "New users" },
] as const

export const SURFACE_OPTIONS = [
  { value: "home", label: "Home / Discover" },
  { value: "for-you", label: "For You" },
] as const
