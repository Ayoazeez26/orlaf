import type { PayoutFilter, PayoutStatus, PayoutView } from "./types"

export const PAYOUT_VIEWS: { key: PayoutView; label: string }[] = [
  { key: "recent", label: "Recent payouts" },
  { key: "analytics", label: "Analytics" },
  { key: "settings", label: "Settings" },
]

export const PAYOUT_FILTERS: { key: PayoutFilter; label: string }[] = [
  { key: "all", label: "All Payouts" },
  { key: "pending", label: "Pending" },
  { key: "scheduled", label: "Scheduled" },
  { key: "paid", label: "Paid" },
  { key: "failed", label: "Failed" },
]

export const PAYOUT_STATUS_LABEL: Record<PayoutStatus, string> = {
  pending: "Pending",
  scheduled: "Scheduled",
  paid: "Paid",
  failed: "Failed",
}

export const PAYOUT_STATUS_BADGE_CLASS: Record<PayoutStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  scheduled: "bg-primary/10 text-primary",
  paid: "bg-emerald-500/10 text-emerald-600",
  failed: "bg-red-500/10 text-red-600",
}

export const PAYOUT_CADENCE_OPTIONS = [
  "Monthly (1st)",
  "Monthly (15th)",
  "Bi-weekly",
  "Weekly",
] as const
