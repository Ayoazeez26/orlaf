import type {
  AdminSeriesDetail,
  AdminSeriesListItem,
  AdminSeriesListResponse,
  CreatorAnalyticsOverview,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export interface ListProjectsParams {
  filter?: "all" | "pending-review" | "rejected"
  creatorId?: string
  q?: string
  page?: number
  pageSize?: number
}

function buildListQuery(params: ListProjectsParams): string {
  const search = new URLSearchParams()
  if (params.filter && params.filter !== "all") {
    search.set("filter", params.filter)
  }
  if (params.creatorId?.trim()) {
    search.set("creatorId", params.creatorId.trim())
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

export function getProjectAnalytics(
  id: string,
  range = "30d"
): Promise<CreatorAnalyticsOverview> {
  return apiRequest<CreatorAnalyticsOverview>(
    `/api/v1/admin/series/${encodeURIComponent(id)}/analytics?range=${range}`
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

export function publishEpisode(
  seriesId: string,
  episodeId: string
): Promise<AdminSeriesDetail> {
  return apiRequest<AdminSeriesDetail>(
    `/api/v1/admin/series/${encodeURIComponent(seriesId)}/episodes/${encodeURIComponent(episodeId)}/publish`,
    { method: "POST", body: JSON.stringify({}) }
  )
}

export function rejectEpisode(
  seriesId: string,
  episodeId: string
): Promise<AdminSeriesDetail> {
  return apiRequest<AdminSeriesDetail>(
    `/api/v1/admin/series/${encodeURIComponent(seriesId)}/episodes/${encodeURIComponent(episodeId)}/reject`,
    { method: "POST", body: JSON.stringify({}) }
  )
}

export function deleteProject(id: string): Promise<void> {
  return apiRequest<void>(`/api/v1/admin/series/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })
}

export type { AdminSeriesDetail, AdminSeriesListItem, AdminSeriesListResponse }
