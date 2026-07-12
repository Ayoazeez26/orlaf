import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { MOCK_NOTIFICATIONS } from "../data/mock-notifications"
import type { NotificationFilter, NotificationItem } from "../types"
import { NotificationsList } from "./notifications-list"
import { NotificationsPageHeader } from "./notifications-page-header"
import { NotificationsStatCards } from "./notifications-stat-cards"
import { NotificationsToolbar } from "./notifications-toolbar"

function matchesFilter(
  notification: NotificationItem,
  filter: NotificationFilter
) {
  if (filter === "all") return true
  if (filter === "unread") return !notification.isRead
  return notification.category === filter
}

export function NotificationsPage({ role: _role }: { role: WorkspaceRoleId }) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(MOCK_NOTIFICATIONS)
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all")

  const filtered = useMemo(
    () => notifications.filter((item) => matchesFilter(item, activeFilter)),
    [notifications, activeFilter]
  )

  const hasUnread = notifications.some((item) => !item.isRead)

  function toggleRead(id: string) {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, isRead: !item.isRead } : item
      )
    )
  }

  function markAllRead() {
    setNotifications((current) =>
      current.map((item) => ({ ...item, isRead: true }))
    )
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <NotificationsPageHeader
        onMarkAllRead={markAllRead}
        hasUnread={hasUnread}
      />
      <NotificationsStatCards notifications={notifications} />

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
          <NotificationsToolbar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <NotificationsList
            notifications={filtered}
            onToggleRead={toggleRead}
          />
        </CardContent>
      </Card>
    </div>
  )
}
