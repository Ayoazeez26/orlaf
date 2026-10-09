import type {
  PlatformSettings,
  UpdatePlatformSettingsRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

const BASE = "/api/v1/admin/settings/notifications"

export function getNotificationSettings(): Promise<PlatformSettings> {
  return apiRequest<PlatformSettings>(BASE)
}

export function updateNotificationSettings(
  body: UpdatePlatformSettingsRequest
): Promise<PlatformSettings> {
  return apiRequest<PlatformSettings>(BASE, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}
