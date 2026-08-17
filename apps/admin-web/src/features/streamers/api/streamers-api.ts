import type {
  AdminStreamerDetail,
  AdminStreamerListFilter,
  AdminStreamerListResponse,
  AdminSuspendStreamerRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export interface ListStreamersParams {
  filter?: AdminStreamerListFilter
  q?: string
  page?: number
  pageSize?: number
}

function buildListQuery(params: ListStreamersParams): string {
  const search = new URLSearchParams()
  if (params.filter && params.filter !== "all")
    search.set("filter", params.filter)
  if (params.q?.trim()) search.set("q", params.q.trim())
  if (params.page) search.set("page", String(params.page))
  if (params.pageSize) search.set("pageSize", String(params.pageSize))
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export function listStreamers(
  params: ListStreamersParams
): Promise<AdminStreamerListResponse> {
  return apiRequest<AdminStreamerListResponse>(
    `/api/v1/admin/streamers${buildListQuery(params)}`
  )
}

export function getStreamer(id: string): Promise<AdminStreamerDetail> {
  return apiRequest<AdminStreamerDetail>(
    `/api/v1/admin/streamers/${encodeURIComponent(id)}`
  )
}

export function suspendStreamer(
  id: string,
  body: AdminSuspendStreamerRequest
): Promise<AdminStreamerDetail> {
  return apiRequest<AdminStreamerDetail>(
    `/api/v1/admin/streamers/${encodeURIComponent(id)}/suspend`,
    { method: "POST", body: JSON.stringify(body) }
  )
}

export function reactivateStreamer(id: string): Promise<AdminStreamerDetail> {
  return apiRequest<AdminStreamerDetail>(
    `/api/v1/admin/streamers/${encodeURIComponent(id)}/reactivate`,
    { method: "POST" }
  )
}
