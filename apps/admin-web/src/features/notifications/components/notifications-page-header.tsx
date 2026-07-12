import { Button } from "@workspace/ui/components/button"
import { CheckCheck } from "lucide-react"

interface NotificationsPageHeaderProps {
  onMarkAllRead: () => void
  hasUnread: boolean
}

export function NotificationsPageHeader({
  onMarkAllRead,
  hasUnread,
}: NotificationsPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Notifications
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Everything that needs your attention, in one place.
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        className="gap-2"
        onClick={onMarkAllRead}
        disabled={!hasUnread}
      >
        <CheckCheck className="size-4" aria-hidden />
        Mark all as read
      </Button>
    </div>
  )
}
