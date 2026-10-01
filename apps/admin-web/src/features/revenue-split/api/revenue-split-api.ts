import type {
  AdminRevenueSplitDashboard,
  CreatorRevenueSplitTier,
  UpdateAdminRevenueSplitTierRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

const BASE = "/api/v1/admin/revenue-split"

export function fetchAdminRevenueSplit(): Promise<AdminRevenueSplitDashboard> {
  return apiRequest<AdminRevenueSplitDashboard>(BASE)
}

export function updateAdminRevenueSplitTier(
  tierId: CreatorRevenueSplitTier,
  body: UpdateAdminRevenueSplitTierRequest
) {
  return apiRequest(`${BASE}/tiers/${encodeURIComponent(tierId)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}
