import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Bell, CheckCheck, ShieldCheck } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { TONE_CHIP_CLASS } from "@/features/workspaces/lib/tones"
import type { Tone } from "@/features/workspaces/types"
import type { NotificationItem } from "../types"

interface NotificationsStatCardsProps {
  notifications: NotificationItem[]
}

export function NotificationsStatCards({
  notifications,
}: NotificationsStatCardsProps) {
  const unreadCount = notifications.filter((item) => !item.isRead).length
  const needsReviewCount = notifications.filter(
    (item) => item.needsReview && !item.isRead
  ).length
  const totalThisWeek = notifications.length

  const stats: {
    label: string
    value: number
    icon: typeof Bell
    tone: Tone
  }[] = [
    { label: "Unread", value: unreadCount, icon: Bell, tone: "primary" },
    {
      label: "Needs review",
      value: needsReviewCount,
      icon: ShieldCheck,
      tone: "warning",
    },
    {
      label: "Total this week",
      value: totalThisWeek,
      icon: CheckCheck,
      tone: "positive",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <Card
            key={stat.label}
            className={cn(FROSTED_CARD_SURFACE_CLASS, "py-5")}
          >
            <CardContent className="flex items-center gap-4 p-0 px-5">
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl",
                  TONE_CHIP_CLASS[stat.tone]
                )}
              >
                <Icon className="size-5" strokeWidth={2} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="truncate text-muted-foreground text-xs uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="font-bold text-2xl text-foreground tracking-tight">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
