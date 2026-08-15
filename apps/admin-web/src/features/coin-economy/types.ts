export type CoinBundleStatus = "live" | "draft"

export type CoinEconomyView =
  | "bundles"
  | "analytics"
  | "purchase-history"
  | "settings"

export type PurchaseStatus = "paid" | "refunded" | "failed"

export type PurchaseFilter = "all" | PurchaseStatus

export interface CoinBundle {
  id: string
  productId: string
  name: string
  coins: number
  bonusCoins: number
  price: string
  effectiveRate: number
  status: CoinBundleStatus
  isBestValue?: boolean
}

export interface CoinPurchase {
  id: string
  receipt: string
  userName: string
  userEmail: string
  bundleLabel: string
  coins: number
  amount: string
  method: string
  status: PurchaseStatus
  date: string
}

export interface CoinsSoldPoint {
  month: string
  amount: number
}

export interface SpendCategory {
  label: string
  percent: number
}

export interface CoinAnalyticsMetric {
  label: string
  value: string
  changePercent: number
  increaseIsGood: boolean
}

export interface CoinEconomySettings {
  coinName: string
  baseConversionRate: string
  allowCoinGifting: boolean
  coinsExpireAfterInactivity: boolean
}

export interface BundleFormValues {
  productId: string
  name: string
  coins: number
  bonusCoins: number
  price: string
  isLive: boolean
}
