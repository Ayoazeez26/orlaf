import type { ArchiveItemType, ArchiveListResponse } from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export type ArchiveFilter = ArchiveItemType | "all" | "promotion"

function archiveKindPath(type: ArchiveItemType): "series" | "episode" {
  return type === "project"
    ? "series"
    : type === "episode"
      ? "episode"
      : "series"
}

export async function fetchArchive(
  type: ArchiveFilter = "all"
): Promise<ArchiveListResponse> {
  const query = type === "all" || type === "promotion" ? "" : `?type=${type}`
  return apiRequest<ArchiveListResponse>(`/api/v1/profile/archive${query}`, {
    method: "GET",
  })
}

export async function restoreArchiveItem(
  type: ArchiveItemType,
  entityId: string
): Promise<void> {
  const kind = archiveKindPath(type)
  await apiRequest(`/api/v1/profile/archive/${kind}/${entityId}/restore`, {
    method: "POST",
    body: JSON.stringify({}),
  })
}

export async function deleteArchiveItem(
  type: ArchiveItemType,
  entityId: string
): Promise<void> {
  const kind = archiveKindPath(type)
  await apiRequest(`/api/v1/profile/archive/${kind}/${entityId}`, {
    method: "DELETE",
  })
}

export async function emptyArchive(): Promise<void> {
  await apiRequest("/api/v1/profile/archive", {
    method: "DELETE",
  })
}
