import { cn } from "@workspace/ui/lib/utils"
import {
  Bell,
  type LucideIcon,
  Megaphone,
  Shield,
  Users,
  Wallet,
} from "lucide-react"
import type { NotificationIcon, NotificationItem } from "../types"

const ICON_MAP: Record<NotificationIcon, LucideIcon> = {
  wallet: Wallet,
  shield: Shield,
  users: Users,
  megaphone: Megaphone,
  bell: Bell,
}

interface NotificationRowProps {
  item: NotificationItem
  className?: string
}

export function NotificationRow({ item, className }: NotificationRowProps) {
  const Icon = ICON_MAP[item.icon]

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 px-5 py-4 sm:px-6",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="size-4 text-primary" strokeWidth={2} aria-hidden />
        </span>
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground text-sm">
              {item.title}
            </p>
            {!item.read ? (
              <span
                className="size-2 shrink-0 rounded-full bg-primary"
                role="img"
                aria-label="Unread"
              />
            ) : null}
          </div>
          <p className="text-muted-foreground text-sm">{item.description}</p>
        </div>
      </div>
      <span className="shrink-0 pt-0.5 text-muted-foreground text-xs">
        {item.timestamp}
      </span>
    </div>
  )
}
