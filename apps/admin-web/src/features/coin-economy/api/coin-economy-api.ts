import type {
  AdminCoinBundle,
  AdminCoinBundleListResponse,
  CreateAdminCoinBundleRequest,
  UpdateAdminCoinBundleRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

const BASE = "/api/v1/admin/economy/bundles"

export function listAdminCoinBundles(): Promise<AdminCoinBundleListResponse> {
  return apiRequest<AdminCoinBundleListResponse>(BASE)
}

export function createAdminCoinBundle(
  body: CreateAdminCoinBundleRequest
): Promise<AdminCoinBundle> {
  return apiRequest<AdminCoinBundle>(BASE, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function updateAdminCoinBundle(
  id: string,
  body: UpdateAdminCoinBundleRequest
): Promise<AdminCoinBundle> {
  return apiRequest<AdminCoinBundle>(
    `${BASE}/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    }
  )
}

export function deleteAdminCoinBundle(id: string): Promise<{ deleted: true }> {
  return apiRequest<{ deleted: true }>(
    `${BASE}/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  )
}
