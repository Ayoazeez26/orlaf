/** In-app + push notification types. */

export const NotificationType = {
  NEW_EPISODE: "new_episode",
  GIFT_RECEIVED: "gift_received",
  GIFT_SENT: "gift_sent",
  COMMENT_REPLY: "comment_reply",
  COIN_PURCHASE: "coin_purchase",
  CREATOR_APPLICATION: "creator_application",
  CONTENT_FLAGGED: "content_flagged",
  PAYOUT_PROCESSED: "payout_processed",
  EPISODE_PUBLISHED: "episode_published",
  PROMOTION_APPROVED: "promotion_approved",
  PROMOTION_REJECTED: "promotion_rejected",
  PROMOTION_BUDGET_LOW: "promotion_budget_low",
  SYSTEM_ALERT: "system_alert",
} as const

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType]

export const NOTIFICATION_TYPES = Object.values(NotificationType)

export type AdminNotificationCategory =
  | "moderation"
  | "promotions"
  | "payouts"
  | "creators"
  | "projects"
  | "system"

export interface AdminNotificationPreferences {
  creator_applications_enabled?: boolean
  content_review_enabled?: boolean
  thumbnail_flagged_enabled?: boolean
  payout_completed_enabled?: boolean
  weekly_digest_enabled?: boolean
  alerts_email?: string
}

export interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  body: string
  data: Record<string, unknown> | null
  read_at: string | null
  created_at: string
}

export interface NotificationListResponse {
  items: NotificationItem[]
  next_cursor: string | null
}

export interface NotificationUnreadCountResponse {
  count: number
}

export interface RegisterPushDeviceRequest {
  expo_push_token: string
  platform: "ios" | "android"
  device_label?: string
}

export interface UnregisterPushDeviceRequest {
  expo_push_token: string
}

export interface UserNotificationSettings {
  push_enabled: boolean
  in_app_enabled: boolean
  new_episode_enabled: boolean
  gift_enabled: boolean
  comment_reply_enabled: boolean
  coin_purchase_enabled: boolean
  admin_preferences?: AdminNotificationPreferences
  updated_at: string
}

export interface UpdateUserNotificationSettingsRequest {
  push_enabled?: boolean
  in_app_enabled?: boolean
  new_episode_enabled?: boolean
  gift_enabled?: boolean
  comment_reply_enabled?: boolean
  coin_purchase_enabled?: boolean
  admin_preferences?: AdminNotificationPreferences
}

export interface UpdateNotificationReadRequest {
  read: boolean
}
