import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"
import {
  AlertTriangle,
  FolderOpen,
  LifeBuoy,
  Megaphone,
  ShieldCheck,
  UserPlus,
  Wallet,
} from "lucide-react"
import { TONE_CHIP_CLASS } from "@/features/workspaces/lib/tones"
import type { Tone } from "@/features/workspaces/types"
import { NOTIFICATION_CATEGORY_LABEL } from "../constants"
import type { NotificationCategory, NotificationItem } from "../types"

interface NotificationsListProps {
  notifications: NotificationItem[]
  onOpen: (notification: NotificationItem) => void
  onToggleRead: (id: string) => void
}

const CATEGORY_CONFIG: Record<
  NotificationCategory,
  { icon: LucideIcon; tone: Tone }
> = {
  promotions: { icon: Megaphone, tone: "primary" },
  moderation: { icon: ShieldCheck, tone: "warning" },
  payouts: { icon: Wallet, tone: "positive" },
  creators: { icon: UserPlus, tone: "primary" },
  projects: { icon: FolderOpen, tone: "info" },
  support: { icon: LifeBuoy, tone: "info" },
  system: { icon: AlertTriangle, tone: "danger" },
}

export function NotificationsList({
  notifications,
  onOpen,
  onToggleRead,
}: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center p-6 text-center text-muted-foreground text-sm">
        No notifications match your filters.
      </div>
    )
  }

  return (
    <ul className="divide-y divide-border/60">
      {notifications.map((notification) => {
        const config = CATEGORY_CONFIG[notification.category]
        const Icon = config.icon

        return (
          <li
            key={notification.id}
            className="-mx-2 flex flex-col gap-4 rounded-xl px-3 py-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-start sm:justify-between"
          >
            <button
              type="button"
              className="flex min-w-0 flex-1 cursor-pointer items-start gap-4 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => onOpen(notification)}
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  TONE_CHIP_CLASS[config.tone]
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>

              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={cn(
                      "text-foreground text-sm",
                      notification.isRead ? "font-medium" : "font-semibold"
                    )}
                  >
                    {notification.title}
                  </p>
                  <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
                    {NOTIFICATION_CATEGORY_LABEL[notification.category]}
                  </span>
                  {!notification.isRead ? (
                    <>
                      <span
                        className="size-2 rounded-full bg-primary"
                        aria-hidden
                      />
                      <span className="sr-only">Unread</span>
                    </>
                  ) : null}
                </div>
                <p className="text-muted-foreground text-sm">
                  {notification.body}
                </p>
                <p className="text-muted-foreground text-xs">
                  {notification.timestamp}
                </p>
              </div>
            </button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 self-start"
              onClick={(event) => {
                event.stopPropagation()
                onToggleRead(notification.id)
              }}
            >
              {notification.isRead ? "Mark unread" : "Mark read"}
            </Button>
          </li>
        )
      })}
    </ul>
  )
}
