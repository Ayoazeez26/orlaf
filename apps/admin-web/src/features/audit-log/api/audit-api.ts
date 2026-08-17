import type { AuditLogListQuery, AuditLogListResponse } from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

function buildQuery(params: AuditLogListQuery): string {
  const search = new URLSearchParams()
  if (params.q?.trim()) search.set("q", params.q.trim())
  if (params.action && params.action !== "all") {
    search.set("action", params.action)
  }
  if (params.page) search.set("page", String(params.page))
  if (params.pageSize) search.set("pageSize", String(params.pageSize))
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export function listAuditLog(
  params: AuditLogListQuery
): Promise<AuditLogListResponse> {
  return apiRequest<AuditLogListResponse>(
    `/api/v1/admin/audit-log${buildQuery(params)}`
  )
}
