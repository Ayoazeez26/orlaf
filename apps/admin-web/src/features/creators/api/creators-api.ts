import type {
  AdminCreatorDetail,
  AdminCreatorListFilter,
  AdminCreatorListResponse,
  AdminSuspendCreatorRequest,
  AdminVerifyCreatorRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export interface ListCreatorsParams {
  filter?: AdminCreatorListFilter
  q?: string
  page?: number
  pageSize?: number
}

function buildListQuery(params: ListCreatorsParams): string {
  const search = new URLSearchParams()
  if (params.filter && params.filter !== "all")
    search.set("filter", params.filter)
  if (params.q?.trim()) search.set("q", params.q.trim())
  if (params.page) search.set("page", String(params.page))
  if (params.pageSize) search.set("pageSize", String(params.pageSize))
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export function listCreators(
  params: ListCreatorsParams
): Promise<AdminCreatorListResponse> {
  return apiRequest<AdminCreatorListResponse>(
    `/api/v1/admin/creators${buildListQuery(params)}`
  )
}

export function getCreator(id: string): Promise<AdminCreatorDetail> {
  return apiRequest<AdminCreatorDetail>(
    `/api/v1/admin/creators/${encodeURIComponent(id)}`
  )
}

export function verifyCreator(
  id: string,
  body: AdminVerifyCreatorRequest = {}
): Promise<AdminCreatorDetail> {
  return apiRequest<AdminCreatorDetail>(
    `/api/v1/admin/creators/${encodeURIComponent(id)}/verify`,
    { method: "POST", body: JSON.stringify(body) }
  )
}

export function unverifyCreator(id: string): Promise<AdminCreatorDetail> {
  return apiRequest<AdminCreatorDetail>(
    `/api/v1/admin/creators/${encodeURIComponent(id)}/unverify`,
    { method: "POST" }
  )
}

export function suspendCreator(
  id: string,
  body: AdminSuspendCreatorRequest
): Promise<AdminCreatorDetail> {
  return apiRequest<AdminCreatorDetail>(
    `/api/v1/admin/creators/${encodeURIComponent(id)}/suspend`,
    { method: "POST", body: JSON.stringify(body) }
  )
}

export function reactivateCreator(id: string): Promise<AdminCreatorDetail> {
  return apiRequest<AdminCreatorDetail>(
    `/api/v1/admin/creators/${encodeURIComponent(id)}/reactivate`,
    { method: "POST" }
  )
}
