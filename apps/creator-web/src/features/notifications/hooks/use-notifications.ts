import { useMemo, useState } from "react"
import { MOCK_NOTIFICATIONS } from "../data/mock-notifications"
import type { NotificationItem, NotificationsData } from "../types"

export function useNotifications(): {
  data: NotificationsData
  markAllAsRead: () => void
} {
  const [items, setItems] = useState(MOCK_NOTIFICATIONS.items)

  return useMemo(
    () => ({
      data: { items },
      markAllAsRead: () => {
        setItems((current) => current.map((item) => ({ ...item, read: true })))
      },
    }),
    [items]
  )
}

export type { NotificationItem }
