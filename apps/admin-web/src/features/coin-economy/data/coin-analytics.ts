import type {
  CoinAnalyticsMetric,
  CoinEconomySettings,
  CoinsSoldPoint,
  SpendCategory,
} from "../types"

export const COINS_SOLD_DATA: CoinsSoldPoint[] = [
  { month: "Dec", amount: 4.2 },
  { month: "Jan", amount: 4.8 },
  { month: "Feb", amount: 5.1 },
  { month: "Mar", amount: 5.6 },
  { month: "Apr", amount: 6.0 },
  { month: "May", amount: 6.4 },
]

export const TOP_SPEND_CATEGORIES: SpendCategory[] = [
  { label: "Unlock premium episode", percent: 38 },
  { label: "Early access", percent: 24 },
  { label: "Tip a creator", percent: 22 },
  { label: "Skip ads 24h", percent: 16 },
]

export const COIN_ANALYTICS_METRICS: CoinAnalyticsMetric[] = [
  {
    label: "Avg coins / buyer",
    value: "820",
    changePercent: 4.2,
    increaseIsGood: true,
  },
  {
    label: "Buyer conversion",
    value: "11.6%",
    changePercent: 0.8,
    increaseIsGood: true,
  },
  {
    label: "Refund rate",
    value: "1.4%",
    changePercent: -0.3,
    increaseIsGood: false,
  },
  {
    label: "Coin sink ratio",
    value: "68%",
    changePercent: -1.1,
    increaseIsGood: true,
  },
]

export const DEFAULT_COIN_SETTINGS: CoinEconomySettings = {
  coinName: "Sable Coins",
  baseConversionRate: "1 ₦ = 0.2 coins",
  allowCoinGifting: false,
  coinsExpireAfterInactivity: false,
}
