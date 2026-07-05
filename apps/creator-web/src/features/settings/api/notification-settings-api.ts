import type {
  CreatorNotificationSettings,
  UpdateCreatorNotificationSettingsRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

function notificationSettingsPath(path = "") {
  return `/api/v1/profile/notification-settings${path}`
}

export async function fetchNotificationSettings(): Promise<CreatorNotificationSettings> {
  return apiRequest<CreatorNotificationSettings>(notificationSettingsPath(), {
    method: "GET",
  })
}

export async function updateNotificationSettings(
  body: UpdateCreatorNotificationSettingsRequest
): Promise<CreatorNotificationSettings> {
  return apiRequest<CreatorNotificationSettings>(notificationSettingsPath(), {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}
