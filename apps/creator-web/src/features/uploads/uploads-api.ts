import type { StudioUploadsResponse } from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export const uploadsQueryKey = ["studio", "uploads"] as const

/** Server view of the creator's episode and trailer videos. */
export function fetchStudioUploads(): Promise<StudioUploadsResponse> {
  return apiRequest<StudioUploadsResponse>("/api/v1/studio/uploads")
}
