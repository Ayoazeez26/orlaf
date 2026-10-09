import type {
  PlatformSettings,
  UpdatePlatformSettingsRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

const BASE = "/api/v1/admin/settings/general"

export function getGeneralSettings(): Promise<PlatformSettings> {
  return apiRequest<PlatformSettings>(BASE)
}

export function updateGeneralSettings(
  body: UpdatePlatformSettingsRequest
): Promise<PlatformSettings> {
  return apiRequest<PlatformSettings>(BASE, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}
