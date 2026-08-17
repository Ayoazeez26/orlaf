import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { NotificationItem } from "../types"
import { NotificationRow } from "./notification-row"

interface NotificationsListCardProps {
  items: NotificationItem[]
  className?: string
  onSelect?: (item: NotificationItem) => void
}

export function NotificationsListCard({
  items,
  className,
  onSelect,
}: NotificationsListCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "gap-0 py-0", className)}>
      <CardContent className="divide-y divide-border px-0 pb-0">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="w-full cursor-pointer text-left transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-muted/50"
            onClick={() => onSelect?.(item)}
          >
            <NotificationRow item={item} />
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
