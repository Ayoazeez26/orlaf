/** User VIP subscription status */

export type SubscriptionStatus = "active" | "expired" | "cancelled"

export const VIP_ENTITLEMENT_ID = "vip"

export const DEFAULT_VIP_PRODUCT_IDS = [
  "sable_vip_monthly",
  "sable_vip_annual",
] as const

export function isVipProductId(productId: string) {
  return (
    DEFAULT_VIP_PRODUCT_IDS.some((id) => id === productId) ||
    productId.toLowerCase().includes("vip")
  )
}

export interface SubscriptionResponse {
  is_vip: boolean
  status: SubscriptionStatus | null
  product_id: string | null
  plan_label: string
  expires_at: string | null
}

export const REVENUECAT_SUBSCRIPTION_ACTIVE_EVENTS = [
  "INITIAL_PURCHASE",
  "RENEWAL",
  "UNCANCELLATION",
  "PRODUCT_CHANGE",
] as const

export const REVENUECAT_SUBSCRIPTION_INACTIVE_EVENTS = [
  "CANCELLATION",
  "EXPIRATION",
  "BILLING_ISSUE",
] as const

export function isRevenueCatSubscriptionActiveEvent(type: string) {
  return REVENUECAT_SUBSCRIPTION_ACTIVE_EVENTS.some((value) => value === type)
}

export function isRevenueCatSubscriptionInactiveEvent(type: string) {
  return REVENUECAT_SUBSCRIPTION_INACTIVE_EVENTS.some(
    (value) => value === type
  )
}
