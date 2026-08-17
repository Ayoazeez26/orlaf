import type {
  NotificationListResponse,
  NotificationUnreadCountResponse,
  UpdateNotificationReadRequest,
  UpdateUserNotificationSettingsRequest,
  UserNotificationSettings,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

const BASE = "/api/v1/notifications"

export function fetchNotifications(params?: {
  cursor?: string
  limit?: number
}): Promise<NotificationListResponse> {
  const search = new URLSearchParams()
  if (params?.cursor) search.set("cursor", params.cursor)
  if (params?.limit) search.set("limit", String(params.limit))
  const qs = search.toString()
  return apiRequest<NotificationListResponse>(`${BASE}${qs ? `?${qs}` : ""}`)
}

export function fetchUnreadNotificationCount(): Promise<NotificationUnreadCountResponse> {
  return apiRequest<NotificationUnreadCountResponse>(`${BASE}/unread-count`)
}

export function setNotificationRead(
  notificationId: string,
  body: UpdateNotificationReadRequest
) {
  return apiRequest<{ read: boolean }>(
    `${BASE}/${encodeURIComponent(notificationId)}/read`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    }
  )
}

export function markAllNotificationsRead() {
  return apiRequest<{ read: true }>(`${BASE}/read-all`, { method: "POST" })
}

export function fetchNotificationSettings(): Promise<UserNotificationSettings> {
  return apiRequest<UserNotificationSettings>(`${BASE}/settings`)
}

export function updateNotificationSettings(
  body: UpdateUserNotificationSettingsRequest
): Promise<UserNotificationSettings> {
  return apiRequest<UserNotificationSettings>(`${BASE}/settings`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}
