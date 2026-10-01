import type { CoinBundle } from "./economy.js"

export interface AdminCoinBundle extends CoinBundle {
  createdAt: string
  updatedAt: string
}

export interface AdminCoinBundleListResponse {
  items: AdminCoinBundle[]
}

export interface CreateAdminCoinBundleRequest {
  productId: string
  name: string
  coins: number
  bonusCoins?: number
  priceLabel: string
  isLive?: boolean
}

export interface UpdateAdminCoinBundleRequest {
  productId?: string
  name?: string
  coins?: number
  bonusCoins?: number
  priceLabel?: string
  isLive?: boolean
}

export type AdminCoinPurchaseStatus = "paid" | "refunded" | "failed"

export type AdminCoinPurchaseFilter = "all" | AdminCoinPurchaseStatus

export interface AdminCoinPurchase {
  id: string
  receipt: string
  account_id: string
  user_name: string
  user_email: string
  bundle_label: string
  coins: number
  amount_label: string
  method: string
  status: AdminCoinPurchaseStatus
  created_at: string
}

export interface AdminCoinPurchaseListQuery {
  filter?: AdminCoinPurchaseFilter
  q?: string
  page?: number
  pageSize?: number
}

export interface AdminCoinPurchaseListResponse {
  items: AdminCoinPurchase[]
  total: number
  page: number
  pageSize: number
}

export interface AdminEconomySpendCategory {
  label: string
  percent: number
}

export interface AdminEconomyCoinsSoldPoint {
  month: string
  coins: number
}

export interface AdminEconomyStats {
  coins_in_circulation: number
  coins_sold_30d: number
  coins_spent_30d: number
  gifts_sent_30d: number
  purchases_30d: number
  unlocks_30d: number
  refunds_30d: number
  coins_sold_by_month: AdminEconomyCoinsSoldPoint[]
  spend_categories: AdminEconomySpendCategory[]
}
