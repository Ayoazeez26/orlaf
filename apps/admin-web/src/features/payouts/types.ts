import type { LucideIcon } from "lucide-react"

export type PayoutStatus = "pending" | "scheduled" | "paid" | "failed"

export type PayoutView = "recent" | "analytics" | "settings"

export type PayoutFilter = "all" | PayoutStatus

export interface Payout {
  id: string
  reference: string
  creatorName: string
  creatorEmail: string
  cycle: string
  amount: number
  method: string
  status: PayoutStatus
  date: string
}

export interface PayoutTrendPoint {
  month: string
  amount: number
}

export interface TopEarner {
  name: string
  amount: number
  percent: number
}

export interface PayoutAnalyticsMetric {
  label: string
  value: string
  changePercent: number
  /** Whether an increase is good (e.g. on-time rate) or bad (e.g. hold-over balance). */
  increaseIsGood: boolean
}

export interface PayoutSettings {
  defaultCreatorShare: number
  verifiedCreatorShare: number
  minimumPayoutThreshold: number
  payoutCadence: string
  holdPeriodDays: number
  autoPayoutsEnabled: boolean
}

export interface PayoutSummaryStat {
  label: string
  value: string
  icon: LucideIcon
}
