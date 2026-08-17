import { useRouter } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { CheckCheck } from "lucide-react"
import { NotificationsListCard } from "../components/notifications-list-card"
import { useNotifications } from "../hooks/use-notifications"

export function NotificationsPage() {
  const router = useRouter()
  const { data, isLoading, markAllAsRead, markRead } = useNotifications()
  const hasUnread = data.items.some((item) => !item.read)

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Stay on top of activity across your channel.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="shrink-0 gap-2 bg-card"
          onClick={() => markAllAsRead()}
          disabled={!hasUnread}
        >
          <CheckCheck className="size-4" aria-hidden />
          Mark all as read
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading notifications…</p>
      ) : data.items.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          You have no notifications yet.
        </p>
      ) : (
        <NotificationsListCard
          items={data.items}
          onSelect={(item) => {
            markRead(item.id)
            if (item.href) {
              router.history.push(item.href)
            }
          }}
        />
      )}
    </div>
  )
}
