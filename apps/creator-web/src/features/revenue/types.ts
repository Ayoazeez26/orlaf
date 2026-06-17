import type { LucideIcon } from "lucide-react"
import type { AnalyticsKpi } from "@/features/analytics/types"

export type RevenueSourceColorKey =
  | "coinUnlocks"
  | "memberships"
  | "pending"
  | "extras"
  | "commission"

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

export type PayoutStatus = "completed" | "pending" | "failed"

export interface RecentPayout {
  id: string
  bankName: string
  last4: string
  date: string
  amount: string
  status: PayoutStatus
}

export type WalletActivityType = "credit" | "debit"

export interface WalletActivity {
  id: string
  type: WalletActivityType
  label: string
  date: string
  amount: string
}

export interface WalletSummary {
  balance: string
  statusText: string
  nextAutoPayout: string
  autoPayoutEnabled: boolean
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
  wallet: WalletSummary
  walletActivity: WalletActivity[]
  earningsOverTime: EarningsOverTimePoint[]
  revenueBreakdown: RevenueBreakdownItem[]
  recentPayouts: RecentPayout[]
  bankAccounts: BankAccount[]
  analyticsKpis: AnalyticsKpi[]
  revenueBySource: RevenueBySourceItem[]
  payoutSchedule: PayoutSchedule
  notifications: RevenueNotificationSetting[]
}
