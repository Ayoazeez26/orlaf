import { BarChart3, CreditCard, Settings, Wallet } from "lucide-react"
import type { RevenueSourceColorKey } from "./types"

export const REVENUE_DATE_RANGE_OPTIONS = [
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
] as const

export const DEFAULT_REVENUE_DATE_RANGE = "Last 30 days"

export const REVENUE_TABS = [
  { id: "wallet", label: "Wallet", icon: Wallet, path: "" },
  { id: "payouts", label: "Payouts", icon: CreditCard, path: "payouts" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "analytics" },
  { id: "settings", label: "Settings", icon: Settings, path: "settings" },
] as const

/** Coin #8E4DFF · Memberships #EC4899 · Tips #FBBF24 · Extras #38BDF8 · Commission #10B981 */
export const REVENUE_SOURCE_COLORS: Record<RevenueSourceColorKey, string> = {
  coinUnlocks: "var(--revenue-coin-unlocks)",
  memberships: "var(--revenue-memberships)",
  pending: "var(--revenue-pending)",
  extras: "var(--revenue-extras)",
  commission: "var(--revenue-commission)",
}

export function revenueTabPath(tabPath: string) {
  if (tabPath === "") {
    return { to: "/dashboard/revenue" as const }
  }
  return {
    to: `/dashboard/revenue/${tabPath}` as const,
  }
}
