import type {
  CreatorPreferences,
  UpdateCreatorPreferencesRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

function preferencesPath(path = "") {
  return `/api/v1/profile/preferences${path}`
}

export async function fetchPreferences(): Promise<CreatorPreferences> {
  return apiRequest<CreatorPreferences>(preferencesPath(), { method: "GET" })
}

export async function updatePreferences(
  body: UpdateCreatorPreferencesRequest
): Promise<CreatorPreferences> {
  return apiRequest<CreatorPreferences>(preferencesPath(), {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}
