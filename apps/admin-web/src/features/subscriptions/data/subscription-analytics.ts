import { CreditCard, RefreshCw, TrendingUp, Users } from "lucide-react"
import type {
  MrrTrendPoint,
  PlanMixItem,
  SubscriptionAnalyticsMetric,
  SubscriptionSettings,
  SubscriptionSummaryStat,
} from "../types"

export const SUBSCRIPTION_SUMMARY_STATS: SubscriptionSummaryStat[] = [
  { label: "Paid subscribers", value: "55,020", icon: Users },
  { label: "MRR", value: "₦78.4M", icon: CreditCard },
  { label: "Trial → paid", value: "42%", icon: TrendingUp },
  { label: "Churn (30d)", value: "3.1%", icon: RefreshCw },
]

export const MRR_TREND_DATA: MrrTrendPoint[] = [
  { month: "Dec", amount: 62_000_000 },
  { month: "Jan", amount: 66_500_000 },
  { month: "Feb", amount: 69_800_000 },
  { month: "Mar", amount: 72_400_000 },
  { month: "Apr", amount: 75_200_000 },
  { month: "May", amount: 78_400_000 },
]

export const MRR_TREND_CHANGE_PERCENT = 12.4

export const PLAN_MIX: PlanMixItem[] = [
  { label: "Free", percent: 77, count: 184_230 },
  { label: "Sable TV Premium", percent: 23, count: 55_020 },
]

export const SUBSCRIPTION_ANALYTICS_METRICS: SubscriptionAnalyticsMetric[] = [
  {
    label: "New (30d)",
    value: "4,210",
    changePercent: 8.1,
    increaseIsGood: true,
  },
  {
    label: "Cancellations",
    value: "1,304",
    changePercent: -2.4,
    increaseIsGood: false,
  },
  {
    label: "ARPU",
    value: "₦1,860",
    changePercent: 1.2,
    increaseIsGood: true,
  },
  {
    label: "LTV",
    value: "₦24,500",
    changePercent: 3.7,
    increaseIsGood: true,
  },
]

export const DEFAULT_SUBSCRIPTION_SETTINGS: SubscriptionSettings = {
  freeTrialDays: 7,
  annualDiscountPercent: 20,
  gracePeriodDays: 3,
  allowPlanChangesMidCycle: true,
  sendRenewalReminderEmail: true,
}
