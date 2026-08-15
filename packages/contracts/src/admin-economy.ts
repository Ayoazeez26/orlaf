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
