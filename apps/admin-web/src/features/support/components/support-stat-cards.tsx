import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { AlertCircle, CheckCircle2, Clock, Inbox } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { TONE_CHIP_CLASS } from "@/features/workspaces/lib/tones"
import type { Tone } from "@/features/workspaces/types"
import type { SupportTicket } from "../types"

interface SupportStatCardsProps {
  tickets: SupportTicket[]
}

export function SupportStatCards({ tickets }: SupportStatCardsProps) {
  const stats: {
    label: string
    value: number
    icon: typeof Inbox
    tone: Tone
  }[] = [
    {
      label: "Open",
      value: tickets.filter((ticket) => ticket.status === "open").length,
      icon: Inbox,
      tone: "danger",
    },
    {
      label: "Urgent",
      value: tickets.filter((ticket) => ticket.priority === "urgent").length,
      icon: AlertCircle,
      tone: "warning",
    },
    {
      label: "In progress",
      value: tickets.filter((ticket) => ticket.status === "in-progress").length,
      icon: Clock,
      tone: "primary",
    },
    {
      label: "Resolved",
      value: tickets.filter((ticket) => ticket.status === "resolved").length,
      icon: CheckCircle2,
      tone: "positive",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
