import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"
import { Calendar, Heart, Sparkles, Star } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { TONE_CHIP_CLASS } from "@/features/workspaces/lib/tones"
import type { Tone } from "@/features/workspaces/types"
import type { DiscoveryRail } from "../types"

interface DiscoveryStatCardsProps {
  rails?: DiscoveryRail[]
}

interface Stat {
  label: string
  value: number
  icon: LucideIcon
  tone: Tone
}

export function DiscoveryStatCards({ rails = [] }: DiscoveryStatCardsProps) {
  const stats: Stat[] = [
    {
      label: "Live rails",
      value: rails.filter((rail) => rail.status === "live").length,
      icon: Sparkles,
      tone: "primary",
    },
    {
      label: "Scheduled",
      value: rails.filter((rail) => rail.status === "scheduled").length,
      icon: Calendar,
      tone: "info",
    },
    {
      label: "Featured hero",
      value: rails.filter((rail) => rail.type === "hero").length,
      icon: Star,
      tone: "warning",
    },
    {
      label: "For You queue",
      value: rails.filter((rail) => rail.surface === "for-you").length,
      icon: Heart,
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
                <p className="truncate font-medium text-muted-foreground text-xs uppercase tracking-wide">
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
