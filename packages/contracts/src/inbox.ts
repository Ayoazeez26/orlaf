export type InboxNotificationType =
  | "projects"
  | "creators"
  | "moderation"
  | "support"
  | "system"

export interface InboxNotification {
  id: string
  title: string
  body: string
  type: InboxNotificationType
  link: string | null
  read: boolean
  timestamp: string
}

export interface InboxListResponse {
  items: InboxNotification[]
  unreadCount: number
}

export interface UpdateInboxNotificationRequest {
  read: boolean
}
