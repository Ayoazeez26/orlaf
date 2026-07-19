import type {
  AdminSeriesDetail,
  AdminSeriesListItem,
  AdminSeriesListResponse,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export interface ListProjectsParams {
  filter?: "all" | "pending-review" | "rejected"
  q?: string
  page?: number
  pageSize?: number
}

function buildListQuery(params: ListProjectsParams): string {
  const search = new URLSearchParams()
  if (params.filter && params.filter !== "all") {
    search.set("filter", params.filter)
  }
  if (params.q?.trim()) search.set("q", params.q.trim())
  if (params.page) search.set("page", String(params.page))
  if (params.pageSize) search.set("pageSize", String(params.pageSize))
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export function listProjects(
  params: ListProjectsParams
): Promise<AdminSeriesListResponse> {
  return apiRequest<AdminSeriesListResponse>(
    `/api/v1/admin/series${buildListQuery(params)}`
  )
}

export function getProject(id: string): Promise<AdminSeriesDetail> {
  return apiRequest<AdminSeriesDetail>(
    `/api/v1/admin/series/${encodeURIComponent(id)}`
  )
}

export function publishProject(
  id: string,
  body: { note?: string } = {}
): Promise<AdminSeriesDetail> {
  return apiRequest<AdminSeriesDetail>(
    `/api/v1/admin/series/${encodeURIComponent(id)}/publish`,
    { method: "POST", body: JSON.stringify(body) }
  )
}

export function rejectProject(
  id: string,
  body: { note?: string } = {}
): Promise<AdminSeriesDetail> {
  return apiRequest<AdminSeriesDetail>(
    `/api/v1/admin/series/${encodeURIComponent(id)}/reject`,
    { method: "POST", body: JSON.stringify(body) }
  )
}

export function unpublishProject(
  id: string,
  body: { note?: string } = {}
): Promise<AdminSeriesDetail> {
  return apiRequest<AdminSeriesDetail>(
    `/api/v1/admin/series/${encodeURIComponent(id)}/unpublish`,
    { method: "POST", body: JSON.stringify(body) }
  )
}

export function deleteProject(id: string): Promise<void> {
  return apiRequest<void>(`/api/v1/admin/series/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })
}

export type { AdminSeriesDetail, AdminSeriesListItem, AdminSeriesListResponse }
