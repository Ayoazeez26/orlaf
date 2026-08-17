import { useRouter } from "@tanstack/react-router"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import {
  useAdminInboxQuery,
  useInboxItems,
  useMarkAllInboxRead,
  useMarkInboxRead,
} from "../api/inbox-hooks"
import {
  resolveAdminInboxHref,
  withSupportTicketHint,
} from "../lib/resolve-inbox-href"
import type { NotificationFilter } from "../types"
import { NotificationsList } from "./notifications-list"
import { NotificationsPageHeader } from "./notifications-page-header"
import { NotificationsStatCards } from "./notifications-stat-cards"
import { NotificationsToolbar } from "./notifications-toolbar"

function matchesFilter(
  isRead: boolean,
  category: string,
  filter: NotificationFilter
) {
  if (filter === "all") return true
  if (filter === "unread") return !isRead
  return category === filter
}

export function NotificationsPage({ role }: { role: WorkspaceRoleId }) {
  const router = useRouter()
  const inboxQuery = useAdminInboxQuery()
  const notifications = useInboxItems()
  const markRead = useMarkInboxRead()
  const markAll = useMarkAllInboxRead()
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all")

  const filtered = useMemo(
    () =>
      notifications.filter((item) =>
        matchesFilter(item.isRead, item.category, activeFilter)
      ),
    [notifications, activeFilter]
  )

  const hasUnread = notifications.some((item) => !item.isRead)

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <NotificationsPageHeader
        onMarkAllRead={() => markAll.mutate()}
        hasUnread={hasUnread}
      />
      {inboxQuery.isLoading ? (
        <p className="text-muted-foreground text-sm">Loading notifications…</p>
      ) : inboxQuery.isError ? (
        <p className="text-destructive text-sm">
          Could not load notifications. Please try again.
        </p>
      ) : (
        <>
          <NotificationsStatCards notifications={notifications} />

          <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
            <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
              <NotificationsToolbar
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
              <NotificationsList
                notifications={filtered}
                onOpen={(item) => {
                  if (!item.isRead) {
                    void markRead.mutateAsync({ id: item.id, read: true })
                  }
                  const href = withSupportTicketHint(
                    resolveAdminInboxHref(role, item.href),
                    item.body
                  )
                  if (href) {
                    router.history.push(href)
                  }
                }}
                onToggleRead={(id) => {
                  const current = notifications.find((item) => item.id === id)
                  void markRead.mutateAsync({
                    id,
                    read: !(current?.isRead ?? false),
                  })
                }}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
