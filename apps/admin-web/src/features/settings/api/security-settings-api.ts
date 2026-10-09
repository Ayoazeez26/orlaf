import type {
  PlatformSettings,
  UpdatePlatformSettingsRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

const BASE = "/api/v1/admin/settings/security"

export function getSecuritySettings(): Promise<PlatformSettings> {
  return apiRequest<PlatformSettings>(BASE)
}

export function updateSecuritySettings(
  body: UpdatePlatformSettingsRequest
): Promise<PlatformSettings> {
  return apiRequest<PlatformSettings>(BASE, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}
