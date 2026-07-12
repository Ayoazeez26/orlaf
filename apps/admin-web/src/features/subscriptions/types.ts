import type { LucideIcon } from "lucide-react"

export type SubscriptionView =
  | "plans"
  | "analytics"
  | "purchase-history"
  | "settings"

export type PurchaseFilter = "all" | PurchaseStatus

export type PurchaseStatus = "paid" | "refunded" | "failed"

export type PlanTierInterval = "week" | "month" | "year" | "forever"

export interface PlanFeature {
  id: string
  label: string
  icon: LucideIcon
}

export interface PlanTier {
  id: string
  label: string
  price: string
  interval: PlanTierInterval
  sublabel: string
  saveBadge?: string
  isBestValue?: boolean
  isSelected?: boolean
}

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  isLive: boolean
  isMostPopular?: boolean
  tiers: PlanTier[]
  includedFeatureIds: string[]
  canDelete?: boolean
}

export interface SubscriptionSummaryStat {
  label: string
  value: string
  icon: LucideIcon
}

export interface PurchaseRecord {
  id: string
  invoice: string
  userName: string
  userEmail: string
  plan: string
  amount: number
  method: string
  status: PurchaseStatus
  date: string
}

export interface MrrTrendPoint {
  month: string
  amount: number
}

export interface PlanMixItem {
  label: string
  percent: number
  count: number
}

export interface SubscriptionAnalyticsMetric {
  label: string
  value: string
  changePercent: number
  increaseIsGood: boolean
}

export interface SubscriptionSettings {
  freeTrialDays: number
  annualDiscountPercent: number
  gracePeriodDays: number
  allowPlanChangesMidCycle: boolean
  sendRenewalReminderEmail: boolean
}

export interface EditPlanTier {
  id: string
  label: string
  price: string
  interval: string
  isBestValue: boolean
}

export interface EditPlanForm {
  name: string
  description: string
  tiers: EditPlanTier[]
  featureIds: string[]
}
