import type { LucideIcon } from "lucide-react"
import type { AnalyticsKpi } from "@/features/analytics/types"
import type { DashboardEarnMoreCard } from "@/features/dashboard/types"

export type RevenueSourceColorKey =
  | "coinUnlocks"
  | "memberships"
  | "pending"
  | "extras"
  | "commission"

export interface RevenueEarningsBreakdownItem {
  label: string
  amount: string
  colorKey: RevenueSourceColorKey
}

export interface EarningsOverTimePoint {
  month: string
  amount: number
}

export interface RevenueBreakdownItem {
  id: string
  label: string
  amount: string
  percent: number
  icon: LucideIcon
}

export interface RevenueBySourceItem {
  label: string
  amount: string
  percent: number
  colorKey: RevenueSourceColorKey
}

export interface RecentPayout {
  id: string
  bankLabel: string
  date: string
  amount: string
}

export interface BankAccount {
  id: string
  bankName: string
  last4: string
  holderName: string
  isPrimary: boolean
}

export type PayoutFrequency = "monthly" | "quarterly"

export interface PayoutSchedule {
  frequency: PayoutFrequency
  isActive: boolean
  nextPayoutAmount: string
  nextPayoutDate: string
}

export interface RevenueNotificationSetting {
  id: string
  label: string
  description: string
  enabled: boolean
}

export interface RevenueDashboardData {
  earningsSummary: {
    total: string
    breakdown: RevenueEarningsBreakdownItem[]
  }
  earningsOverTime: EarningsOverTimePoint[]
  revenueBreakdown: RevenueBreakdownItem[]
  earnMoreCards: DashboardEarnMoreCard[]
  recentPayouts: RecentPayout[]
  bankAccounts: BankAccount[]
  analyticsKpis: AnalyticsKpi[]
  revenueBySource: RevenueBySourceItem[]
  payoutSchedule: PayoutSchedule
  notifications: RevenueNotificationSetting[]
}
