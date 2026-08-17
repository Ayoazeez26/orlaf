import type {
  CreateModerationReportRequest,
  ModerationListQuery,
  ModerationListResponse,
  ModerationReportDetail,
  UpdateModerationReportRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

function buildQuery(params: ModerationListQuery): string {
  const search = new URLSearchParams()
  if (params.filter && params.filter !== "all") {
    search.set("filter", params.filter)
  }
  if (params.q?.trim()) search.set("q", params.q.trim())
  if (params.seriesId) search.set("seriesId", params.seriesId)
  if (params.page) search.set("page", String(params.page))
  if (params.pageSize) search.set("pageSize", String(params.pageSize))
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export function listModerationReports(
  params: ModerationListQuery
): Promise<ModerationListResponse> {
  return apiRequest<ModerationListResponse>(
    `/api/v1/admin/moderation/reports${buildQuery(params)}`
  )
}

export function getModerationReport(
  id: string
): Promise<ModerationReportDetail> {
  return apiRequest<ModerationReportDetail>(
    `/api/v1/admin/moderation/reports/${encodeURIComponent(id)}`
  )
}

export function createModerationReport(
  body: CreateModerationReportRequest
): Promise<ModerationReportDetail> {
  return apiRequest<ModerationReportDetail>(
    "/api/v1/admin/moderation/reports",
    { method: "POST", body: JSON.stringify(body) }
  )
}

export function updateModerationReport(
  id: string,
  body: UpdateModerationReportRequest
): Promise<ModerationReportDetail> {
  return apiRequest<ModerationReportDetail>(
    `/api/v1/admin/moderation/reports/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify(body) }
  )
}
