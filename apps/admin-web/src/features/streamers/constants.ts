import type { CoinTransactionType, StreamerPlan, StreamerStatus } from "./types"

export type StreamerFilter = "all" | "active" | "suspended" | "new"

export const STREAMER_FILTERS: { key: StreamerFilter; label: string }[] = [
  { key: "all", label: "All Streamers" },
  { key: "active", label: "Active" },
  { key: "suspended", label: "Suspended" },
  { key: "new", label: "New" },
]

export const STREAMER_PLANS: StreamerPlan[] = [
  "Premium",
  "VIP",
  "Basic",
  "Free",
]

/** Plan badge color per plan tier. */
export const PLAN_BADGE_CLASS: Record<StreamerPlan, string> = {
  Premium: "bg-emerald-500/10 text-emerald-600",
  VIP: "bg-amber-500/10 text-amber-600",
  Basic: "bg-indigo-500/10 text-indigo-600",
  Free: "bg-muted text-muted-foreground",
}

/** Status pill color per account status. */
export const STATUS_BADGE_CLASS: Record<StreamerStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-600",
  suspended: "bg-amber-500/10 text-amber-600",
  banned: "bg-red-500/10 text-red-600",
}

/** Coin transaction type badge color. */
export const TRANSACTION_TYPE_BADGE_CLASS: Record<CoinTransactionType, string> =
  {
    purchase: "bg-primary/10 text-primary",
    gift: "bg-primary/10 text-primary",
    unlock: "bg-red-500/10 text-red-600",
  }
