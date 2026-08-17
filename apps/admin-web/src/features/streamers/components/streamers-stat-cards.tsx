import type { AdminStreamerStats } from "@sable/contracts"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"
import { Sparkles, UserCheck, Users, UserX } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { TONE_CHIP_CLASS } from "@/features/workspaces/lib/tones"
import type { Tone } from "@/features/workspaces/types"

interface StreamersStatCardsProps {
  stats: AdminStreamerStats
}

interface Stat {
  label: string
  value: number
  icon: LucideIcon
  tone: Tone
}

export function StreamersStatCards({ stats }: StreamersStatCardsProps) {
  const cards: Stat[] = [
    {
      label: "Total streamers",
      value: stats.total,
      icon: Users,
      tone: "primary",
    },
    {
      label: "Active",
      value: stats.active,
      icon: UserCheck,
      tone: "positive",
    },
    {
      label: "Suspended",
      value: stats.suspended,
      icon: UserX,
      tone: "danger",
    },
    {
      label: "New this month",
      value: stats.newThisMonth,
      icon: Sparkles,
      tone: "warning",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((stat) => {
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
                <p className="truncate text-muted-foreground text-xs">
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
