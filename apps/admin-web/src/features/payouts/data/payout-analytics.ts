import type {
  PayoutAnalyticsMetric,
  PayoutSettings,
  PayoutTrendPoint,
  TopEarner,
} from "../types"

export const PAYOUT_TREND_DATA: PayoutTrendPoint[] = [
  { month: "Dec", amount: 32_400_000 },
  { month: "Jan", amount: 34_800_000 },
  { month: "Feb", amount: 36_200_000 },
  { month: "Mar", amount: 38_600_000 },
  { month: "Apr", amount: 39_800_000 },
  { month: "May", amount: 42_600_000 },
]

export const PAYOUT_TREND_CHANGE_PERCENT = 7.6

export const TOP_EARNERS: TopEarner[] = [
  { name: "Ifeoma Eze", amount: 210_400, percent: 100 },
  { name: "Ada Obi", amount: 184_500, percent: 88 },
  { name: "Adaeze Okafor", amount: 121_200, percent: 58 },
  { name: "Tunde Bello", amount: 92_300, percent: 44 },
  { name: "Mark Johnson", amount: 64_900, percent: 31 },
]

export const PAYOUT_ANALYTICS_METRICS: PayoutAnalyticsMetric[] = [
  {
    label: "Avg payout",
    value: "₦33,180",
    changePercent: 4.1,
    increaseIsGood: true,
  },
  {
    label: "On-time rate",
    value: "98.2%",
    changePercent: 0.6,
    increaseIsGood: true,
  },
  {
    label: "Failure rate",
    value: "1.4%",
    changePercent: -0.3,
    increaseIsGood: false,
  },
  {
    label: "Hold-over balance",
    value: "₦2.4M",
    changePercent: 12.0,
    increaseIsGood: false,
  },
]

export const DEFAULT_PAYOUT_SETTINGS: PayoutSettings = {
  defaultCreatorShare: 60,
  verifiedCreatorShare: 70,
  minimumPayoutThreshold: 25_000,
  payoutCadence: "Monthly (1st)",
  holdPeriodDays: 14,
  autoPayoutsEnabled: true,
}
