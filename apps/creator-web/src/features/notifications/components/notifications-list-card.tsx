import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { NotificationItem } from "../types"
import { NotificationRow } from "./notification-row"

interface NotificationsListCardProps {
  items: NotificationItem[]
  className?: string
}

export function NotificationsListCard({
  items,
  className,
}: NotificationsListCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "gap-0 py-0", className)}>
      <CardContent className="divide-y divide-border px-0 pb-0">
        {items.map((item) => (
          <NotificationRow key={item.id} item={item} />
        ))}
      </CardContent>
    </Card>
  )
}
