import type {
  AdminSubscriptionPlansResponse,
  AdminSubscriptionPurchaseListQuery,
  AdminSubscriptionPurchaseListResponse,
  AdminSubscriptionSettings,
  AdminSubscriptionStats,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

const BASE = "/api/v1/admin/subscriptions"

export function fetchAdminSubscriptionStats(): Promise<AdminSubscriptionStats> {
  return apiRequest<AdminSubscriptionStats>(`${BASE}/stats`)
}

export function fetchAdminSubscriptionSettings(): Promise<AdminSubscriptionSettings> {
  return apiRequest<AdminSubscriptionSettings>(`${BASE}/settings`)
}

export function fetchAdminSubscriptionPlans(): Promise<AdminSubscriptionPlansResponse> {
  return apiRequest<AdminSubscriptionPlansResponse>(`${BASE}/plans`)
}

export function listAdminSubscriptionPurchases(
  query: AdminSubscriptionPurchaseListQuery = {}
): Promise<AdminSubscriptionPurchaseListResponse> {
  const params = new URLSearchParams()
  if (query.filter) params.set("filter", query.filter)
  if (query.q) params.set("q", query.q)
  if (query.page) params.set("page", String(query.page))
  if (query.pageSize) params.set("pageSize", String(query.pageSize))
  const qs = params.toString()
  return apiRequest<AdminSubscriptionPurchaseListResponse>(
    `${BASE}/purchases${qs ? `?${qs}` : ""}`
  )
}
