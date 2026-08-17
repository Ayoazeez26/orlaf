import type {
  InboxListResponse,
  UpdateInboxNotificationRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export function listInbox(): Promise<InboxListResponse> {
  return apiRequest<InboxListResponse>("/api/v1/notifications")
}

export function updateInboxItem(
  id: string,
  body: UpdateInboxNotificationRequest
): Promise<void> {
  return apiRequest<void>(`/api/v1/notifications/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export function markAllInboxRead(): Promise<void> {
  return apiRequest<void>("/api/v1/notifications/read-all", { method: "POST" })
}
