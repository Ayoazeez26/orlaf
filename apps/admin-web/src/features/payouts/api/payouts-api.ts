import type {
  AdminPayoutListQuery,
  AdminPayoutListResponse,
  AdminPayoutStats,
  ApproveAdminPayoutRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"
import type { Payout } from "../types"

const BASE = "/api/v1/admin/payouts"

export function fetchAdminPayoutStats(): Promise<AdminPayoutStats> {
  return apiRequest<AdminPayoutStats>(`${BASE}/stats`)
}

function mapPayoutStatus(
  status: AdminPayoutListResponse["items"][number]["status"]
): Payout["status"] {
  if (status === "rejected") return "failed"
  return status
}

function mapPayout(item: AdminPayoutListResponse["items"][number]): Payout {
  return {
    id: item.id,
    reference: item.reference,
    creatorName: item.creator_name,
    creatorEmail: item.creator_email,
    cycle: item.cycle,
    amount: Math.round(item.amount_minor / 100),
    method: item.method,
    status: mapPayoutStatus(item.status),
    date: item.date,
  }
}

export async function listAdminPayouts(
  query: AdminPayoutListQuery = {}
): Promise<{ items: Payout[]; total: number }> {
  const params = new URLSearchParams()
  if (query.status) params.set("status", query.status)
  if (query.creator_id) params.set("creator_id", query.creator_id)
  if (query.q) params.set("q", query.q)
  if (query.page) params.set("page", String(query.page))
  if (query.pageSize) params.set("pageSize", String(query.pageSize))
  const qs = params.toString()

  const response = await apiRequest<AdminPayoutListResponse>(
    `${BASE}${qs ? `?${qs}` : ""}`
  )

  return {
    items: response.items.map(mapPayout),
    total: response.total,
  }
}

export async function approveAdminPayout(
  payoutId: string,
  body: ApproveAdminPayoutRequest
): Promise<void> {
  await apiRequest(`${BASE}/${encodeURIComponent(payoutId)}/approve`, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function markAdminPayoutPaid(payoutId: string): Promise<void> {
  await apiRequest(`${BASE}/${encodeURIComponent(payoutId)}/mark-paid`, {
    method: "POST",
  })
}
