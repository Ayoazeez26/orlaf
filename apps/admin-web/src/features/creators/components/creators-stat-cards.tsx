import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"
import { Star, UserCheck, Users, UserX } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { TONE_CHIP_CLASS } from "@/features/workspaces/lib/tones"
import type { Tone } from "@/features/workspaces/types"
import type { Creator } from "../types"

interface CreatorsStatCardsProps {
  creators: Creator[]
}

interface Stat {
  label: string
  value: number
  icon: LucideIcon
  tone: Tone
}

export function CreatorsStatCards({ creators }: CreatorsStatCardsProps) {
  const stats: Stat[] = [
    {
      label: "Total creators",
      value: creators.length,
      icon: Users,
      tone: "primary",
    },
    {
      label: "Active",
      value: creators.filter((c) => c.status === "active").length,
      icon: UserCheck,
      tone: "positive",
    },
    {
      label: "Suspended",
      value: creators.filter((c) => c.status === "suspended").length,
      icon: UserX,
      tone: "danger",
    },
    {
      label: "New this month",
      value: creators.filter((c) => c.isNew).length,
      icon: Star,
      tone: "warning",
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
