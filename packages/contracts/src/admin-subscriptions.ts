import { DEFAULT_VIP_PRODUCT_IDS } from "./subscriptions.js"

/** Nominal NGN amounts for admin MRR estimates (store prices are source of truth in RC). */
export const VIP_PLAN_NOMINAL_NGN: Record<
  (typeof DEFAULT_VIP_PRODUCT_IDS)[number],
  { label: string; amount_ngn: number; interval: "month" | "year" }
> = {
  sable_vip_monthly: {
    label: "Monthly",
    amount_ngn: 3_500,
    interval: "month",
  },
  sable_vip_annual: {
    label: "Annual",
    amount_ngn: 25_000,
    interval: "year",
  },
}

export type AdminSubscriptionPurchaseStatus = "paid" | "refunded" | "failed"

export type AdminSubscriptionPurchaseFilter =
  | "all"
  | AdminSubscriptionPurchaseStatus

export interface AdminSubscriptionPlanTier {
  id: string
  product_id: string | null
  label: string
  price_label: string
  interval: "week" | "month" | "year" | "forever"
  sublabel: string
  is_store_sku: boolean
}

export interface AdminSubscriptionPlan {
  id: string
  name: string
  description: string
  is_live: boolean
  is_read_only: boolean
  tiers: AdminSubscriptionPlanTier[]
}

export interface AdminSubscriptionSummaryStat {
  key: string
  label: string
  value: string
  raw_value?: number
}

export interface AdminSubscriptionMrrPoint {
  month: string
  amount_ngn: number
  active_count: number
}

export interface AdminSubscriptionPlanMixItem {
  label: string
  count: number
  percent: number
}

export interface AdminSubscriptionAnalyticsMetric {
  label: string
  value: string
  raw_value: number
  change_percent: number
  increase_is_good: boolean
}

export interface AdminSubscriptionStats {
  summary: AdminSubscriptionSummaryStat[]
  mrr_trend: AdminSubscriptionMrrPoint[]
  mrr_change_percent: number
  plan_mix: AdminSubscriptionPlanMixItem[]
  metrics: AdminSubscriptionAnalyticsMetric[]
}

export interface AdminSubscriptionPurchase {
  id: string
  invoice: string
  account_id: string
  user_name: string
  user_email: string
  plan: string
  product_id: string
  amount_ngn: number
  method: string
  status: AdminSubscriptionPurchaseStatus
  date: string
  expires_at: string | null
}

export interface AdminSubscriptionPurchaseListQuery {
  filter?: AdminSubscriptionPurchaseFilter
  q?: string
  page?: number
  pageSize?: number
}

export interface AdminSubscriptionPurchaseListResponse {
  items: AdminSubscriptionPurchase[]
  total: number
  page: number
  pageSize: number
}

export interface AdminSubscriptionPlansResponse {
  items: AdminSubscriptionPlan[]
}

/** Read-only — trials and billing are configured in RevenueCat / app stores. */
export interface AdminSubscriptionSettings {
  free_trial_days: number
  annual_discount_percent: number
  grace_period_days: number
  allow_plan_changes_mid_cycle: boolean
  send_renewal_reminder_email: boolean
  is_read_only: true
  managed_in: "revenuecat"
}
