import type { CoinBundleStatus, PurchaseStatus } from "./types"

export const COIN_ECONOMY_VIEWS = [
  { key: "bundles" as const, label: "Bundles" },
  { key: "analytics" as const, label: "Analytics" },
  { key: "purchase-history" as const, label: "Purchase history" },
  { key: "settings" as const, label: "Settings" },
]

export const PURCHASE_FILTERS = [
  { key: "all" as const, label: "All" },
  { key: "paid" as const, label: "Paid" },
  { key: "refunded" as const, label: "Refunded" },
  { key: "failed" as const, label: "Failed" },
]

export const BUNDLE_STATUS_BADGE_CLASS: Record<CoinBundleStatus, string> = {
  live: "bg-emerald-500/10 text-emerald-600",
  draft: "bg-muted text-muted-foreground",
}

export const PURCHASE_STATUS_BADGE_CLASS: Record<PurchaseStatus, string> = {
  paid: "bg-emerald-500/10 text-emerald-600",
  refunded: "bg-muted text-muted-foreground",
  failed: "bg-red-500/10 text-red-600",
}

export const COINS_SOLD_CHANGE_PERCENT = 8.5
