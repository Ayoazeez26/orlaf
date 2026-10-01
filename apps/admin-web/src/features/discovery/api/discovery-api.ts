import type {
  AddDiscoveryRailItemRequest,
  CreateDiscoveryRailRequest,
  DiscoveryRail,
  DiscoveryRailsResponse,
  DiscoverySurface,
  ForYouPreviewResponse,
  ReorderDiscoveryRailsRequest,
  SetForYouOverrideRequest,
  UpdateDiscoveryRailRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export function listDiscoveryRails(): Promise<DiscoveryRailsResponse> {
  return apiRequest<DiscoveryRailsResponse>("/api/v1/admin/discovery/rails")
}

export function createDiscoveryRail(
  body: CreateDiscoveryRailRequest
): Promise<DiscoveryRail> {
  return apiRequest<DiscoveryRail>("/api/v1/admin/discovery/rails", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function updateDiscoveryRail(
  id: string,
  body: UpdateDiscoveryRailRequest
): Promise<DiscoveryRail> {
  return apiRequest<DiscoveryRail>(
    `/api/v1/admin/discovery/rails/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify(body) }
  )
}

export function reorderDiscoveryRails(
  surface: DiscoverySurface,
  body: ReorderDiscoveryRailsRequest
): Promise<void> {
  return apiRequest<void>(
    `/api/v1/admin/discovery/rails/reorder?surface=${encodeURIComponent(surface)}`,
    { method: "POST", body: JSON.stringify(body) }
  )
}

export function deleteDiscoveryRail(id: string): Promise<void> {
  return apiRequest<void>(
    `/api/v1/admin/discovery/rails/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  )
}

export function addDiscoveryRailItem(
  railId: string,
  body: AddDiscoveryRailItemRequest
): Promise<DiscoveryRail> {
  return apiRequest<DiscoveryRail>(
    `/api/v1/admin/discovery/rails/${encodeURIComponent(railId)}/items`,
    { method: "POST", body: JSON.stringify(body) }
  )
}

export function removeDiscoveryRailItem(
  railId: string,
  seriesId: string
): Promise<void> {
  return apiRequest<void>(
    `/api/v1/admin/discovery/rails/${encodeURIComponent(railId)}/items/${encodeURIComponent(seriesId)}`,
    { method: "DELETE" }
  )
}

export function getForYouPreview(): Promise<ForYouPreviewResponse> {
  return apiRequest<ForYouPreviewResponse>(
    "/api/v1/admin/discovery/for-you/preview"
  )
}

export function setForYouOverride(
  seriesId: string,
  body: SetForYouOverrideRequest
): Promise<ForYouPreviewResponse> {
  return apiRequest<ForYouPreviewResponse>(
    `/api/v1/admin/discovery/for-you/overrides/${encodeURIComponent(seriesId)}`,
    { method: "PUT", body: JSON.stringify(body) }
  )
}

export function clearForYouOverride(
  seriesId: string
): Promise<ForYouPreviewResponse> {
  return apiRequest<ForYouPreviewResponse>(
    `/api/v1/admin/discovery/for-you/overrides/${encodeURIComponent(seriesId)}`,
    { method: "DELETE" }
  )
}
