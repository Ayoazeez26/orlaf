import type {
  AdminSubscriptionPlan,
  AdminSubscriptionStats,
} from "@sable/contracts"
import { CreditCard, RefreshCw, TrendingUp, Users } from "lucide-react"
import type {
  MrrTrendPoint,
  PlanMixItem,
  PlanTier,
  PurchaseRecord,
  SubscriptionAnalyticsMetric,
  SubscriptionPlan,
  SubscriptionSummaryStat,
} from "../types"

const SUMMARY_ICONS = [Users, CreditCard, TrendingUp, RefreshCw] as const

export function mapSubscriptionSummary(
  stats: AdminSubscriptionStats
): SubscriptionSummaryStat[] {
  return stats.summary.map((row, index) => ({
    label: row.label,
    value: row.value,
    icon: SUMMARY_ICONS[index] ?? Users,
  }))
}

export function mapMrrTrend(stats: AdminSubscriptionStats): {
  data: MrrTrendPoint[]
  changePercent: number
} {
  return {
    data: stats.mrr_trend.map((point) => ({
      month: point.month,
      amount: point.amount_ngn,
    })),
    changePercent: stats.mrr_change_percent,
  }
}

export function mapPlanMix(stats: AdminSubscriptionStats): PlanMixItem[] {
  return stats.plan_mix.map((item) => ({
    label: item.label,
    count: item.count,
    percent: item.percent,
  }))
}

export function mapAnalyticsMetrics(
  stats: AdminSubscriptionStats
): SubscriptionAnalyticsMetric[] {
  return stats.metrics.map((metric) => ({
    label: metric.label,
    value: metric.value,
    changePercent: metric.change_percent,
    increaseIsGood: metric.increase_is_good,
  }))
}

export function mapAdminPlans(
  items: AdminSubscriptionPlan[]
): SubscriptionPlan[] {
  return items.map((plan) => ({
    id: plan.id,
    name: plan.name,
    description: plan.description,
    isLive: plan.is_live,
    isMostPopular: plan.id === "vip",
    canDelete: false,
    tiers: plan.tiers.map(
      (tier): PlanTier => ({
        id: tier.id,
        label: tier.label,
        price: tier.price_label,
        interval: tier.interval,
        sublabel: tier.sublabel,
        isSelected: tier.is_store_sku,
      })
    ),
    includedFeatureIds:
      plan.id === "vip"
        ? [
            "unlimited-episodes",
            "ad-free",
            "offline-downloads",
            "4k-hdr",
            "multi-device",
            "coin-bonus",
          ]
        : [],
  }))
}

export function mapAdminPurchase(item: {
  id: string
  invoice: string
  user_name: string
  user_email: string
  plan: string
  amount_ngn: number
  method: string
  status: PurchaseRecord["status"]
  date: string
}): PurchaseRecord {
  return {
    id: item.id,
    invoice: item.invoice,
    userName: item.user_name,
    userEmail: item.user_email,
    plan: item.plan,
    amount: item.amount_ngn,
    method: item.method,
    status: item.status,
    date: item.date,
  }
}
