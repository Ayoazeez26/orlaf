export enum CoinLedgerEntryType {
  PURCHASE = "purchase",
  UNLOCK = "unlock",
  GIFT_OUT = "gift_out",
  GIFT_IN = "gift_in",
  REFUND = "refund",
  ADJUSTMENT = "adjustment",
}

export const COIN_LEDGER_ENTRY_TYPES = Object.values(CoinLedgerEntryType)

export enum CoinLedgerDirection {
  CREDIT = "credit",
  DEBIT = "debit",
}

export const COIN_LEDGER_DIRECTIONS = Object.values(CoinLedgerDirection)

export enum CoinLedgerReferenceType {
  REVENUECAT_EVENT = "revenuecat_event",
  EPISODE = "episode",
  CREATOR_GIFT = "creator_gift",
}

export enum RevenueCatEventType {
  INITIAL_PURCHASE = "INITIAL_PURCHASE",
  NON_RENEWING_PURCHASE = "NON_RENEWING_PURCHASE",
  CANCELLATION = "CANCELLATION",
  REFUND = "REFUND",
}

export const REVENUECAT_PURCHASE_EVENT_TYPES = [
  RevenueCatEventType.INITIAL_PURCHASE,
  RevenueCatEventType.NON_RENEWING_PURCHASE,
] as const

export const REVENUECAT_REFUND_EVENT_TYPES = [
  RevenueCatEventType.CANCELLATION,
  RevenueCatEventType.REFUND,
] as const

export function isRevenueCatPurchaseEvent(type: string) {
  return REVENUECAT_PURCHASE_EVENT_TYPES.some((value) => value === type)
}

export function isRevenueCatRefundEvent(type: string) {
  return REVENUECAT_REFUND_EVENT_TYPES.some((value) => value === type)
}

export const DEFAULT_EPISODE_COIN_PRICE = 50

export const GiftKey = {
  ROSE: "rose",
  HEART: "heart",
  ROCKET: "rocket",
  CROWN: "crown",
  DIAMOND: "diamond",
  BOUQUET: "bouquet",
} as const

export type GiftKey = (typeof GiftKey)[keyof typeof GiftKey]

export const GIFT_KEYS = Object.values(GiftKey)

export const DEFAULT_GIFT_CATALOG = [
  { key: GiftKey.ROSE, name: "Rose", emoji: "🌹", coins: 5 },
  { key: GiftKey.HEART, name: "Heart", emoji: "💜", coins: 15 },
  { key: GiftKey.ROCKET, name: "Rocket", emoji: "🚀", coins: 30 },
  { key: GiftKey.CROWN, name: "Crown", emoji: "👑", coins: 50 },
  { key: GiftKey.DIAMOND, name: "Diamond", emoji: "💎", coins: 150 },
  { key: GiftKey.BOUQUET, name: "Bouquet", emoji: "💐", coins: 500 },
] as const

export type GiftCatalogItem = (typeof DEFAULT_GIFT_CATALOG)[number]

export const DEFAULT_COIN_BUNDLES = [
  {
    productId: "sable_coins_60",
    name: "Starter",
    coins: 60,
    bonusCoins: 0,
    priceLabel: "$0.99",
    popular: false,
  },
  {
    productId: "sable_coins_180",
    name: "Popular",
    coins: 180,
    bonusCoins: 18,
    priceLabel: "$2.99",
    popular: true,
  },
  {
    productId: "sable_coins_400",
    name: "Plus",
    coins: 400,
    bonusCoins: 100,
    priceLabel: "$5.99",
    popular: false,
  },
  {
    productId: "sable_coins_1000",
    name: "Pro",
    coins: 1000,
    bonusCoins: 400,
    priceLabel: "$12.99",
    popular: false,
  },
] as const

export type CoinBundleProductId = (typeof DEFAULT_COIN_BUNDLES)[number]["productId"]

export const DEFAULT_COIN_PACKAGE_ID: CoinBundleProductId =
  DEFAULT_COIN_BUNDLES.find((bundle) => bundle.popular)?.productId ??
  DEFAULT_COIN_BUNDLES[0].productId

export interface CoinBundle {
  id: string
  productId: string
  name: string
  coins: number
  bonusCoins: number
  priceLabel: string
  isLive: boolean
}

export interface WalletResponse {
  account_id: string
  balance: number
}

export interface UnlockEpisodeResponse {
  already_unlocked: boolean
  coins_spent: number
  hls_url: string | null
  dash_url: string | null
  balance: number
}

export interface SendGiftRequest {
  giftKey: GiftKey
}

export interface SendGiftResponse {
  gift_id: string
  coins: number
  gift_key: GiftKey
  sender_balance: number
  creator_balance: number
}

export interface CreditPurchaseResponse {
  credited: boolean
  entry_id?: string
  balance?: number
  ignored?: boolean
  type?: string
}
