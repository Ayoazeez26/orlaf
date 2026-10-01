import type {
  CreateCreatorPayoutAccountRequest,
  CreateCreatorPayoutRequestBody,
  CreateCreatorPayoutRequestResponse,
  CreatorPayoutAccount,
  CreatorRevenueDashboard,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"
import { mapRevenueDashboard } from "../lib/map-revenue-dashboard"
import type { PayoutFrequency, RevenueDashboardData } from "../types"

const BASE = "/api/v1/studio/revenue"

export async function fetchRevenueDashboard(): Promise<RevenueDashboardData> {
  const data = await apiRequest<CreatorRevenueDashboard>(`${BASE}/dashboard`)
  return mapRevenueDashboard(data)
}

export async function createPayoutAccount(
  body: CreateCreatorPayoutAccountRequest
): Promise<CreatorPayoutAccount> {
  return apiRequest<CreatorPayoutAccount>(`${BASE}/payout-accounts`, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function deletePayoutAccount(accountId: string): Promise<void> {
  await apiRequest(`${BASE}/payout-accounts/${encodeURIComponent(accountId)}`, {
    method: "DELETE",
  })
}

export async function requestPayout(
  body: CreateCreatorPayoutRequestBody
): Promise<CreateCreatorPayoutRequestResponse> {
  return apiRequest<CreateCreatorPayoutRequestResponse>(
    `${BASE}/payout-requests`,
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  )
}

export async function updatePayoutFrequency(
  frequency: PayoutFrequency
): Promise<RevenueDashboardData> {
  void frequency
  return fetchRevenueDashboard()
}
