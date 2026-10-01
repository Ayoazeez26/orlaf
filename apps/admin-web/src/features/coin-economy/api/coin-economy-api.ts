import type {
  AdminCoinBundle,
  AdminCoinBundleListResponse,
  AdminCoinPurchaseListQuery,
  AdminCoinPurchaseListResponse,
  AdminEconomyStats,
  CreateAdminCoinBundleRequest,
  UpdateAdminCoinBundleRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

const BASE = "/api/v1/admin/economy"
const BUNDLES_BASE = `${BASE}/bundles`

export function listAdminCoinBundles(): Promise<AdminCoinBundleListResponse> {
  return apiRequest<AdminCoinBundleListResponse>(BUNDLES_BASE)
}

export function listAdminCoinPurchases(
  query: AdminCoinPurchaseListQuery = {}
): Promise<AdminCoinPurchaseListResponse> {
  const params = new URLSearchParams()
  if (query.filter) params.set("filter", query.filter)
  if (query.q) params.set("q", query.q)
  if (query.page) params.set("page", String(query.page))
  if (query.pageSize) params.set("pageSize", String(query.pageSize))
  const qs = params.toString()
  return apiRequest<AdminCoinPurchaseListResponse>(
    `${BASE}/purchases${qs ? `?${qs}` : ""}`
  )
}

export function fetchAdminEconomyStats(): Promise<AdminEconomyStats> {
  return apiRequest<AdminEconomyStats>(`${BASE}/stats`)
}

export function createAdminCoinBundle(
  body: CreateAdminCoinBundleRequest
): Promise<AdminCoinBundle> {
  return apiRequest<AdminCoinBundle>(BUNDLES_BASE, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function updateAdminCoinBundle(
  id: string,
  body: UpdateAdminCoinBundleRequest
): Promise<AdminCoinBundle> {
  return apiRequest<AdminCoinBundle>(
    `${BUNDLES_BASE}/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    }
  )
}

export function deleteAdminCoinBundle(id: string): Promise<{ deleted: true }> {
  return apiRequest<{ deleted: true }>(
    `${BUNDLES_BASE}/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  )
}
