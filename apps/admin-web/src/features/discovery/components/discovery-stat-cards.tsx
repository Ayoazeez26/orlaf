import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"
import { Layers, Pin, Sparkles, Star } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { TONE_CHIP_CLASS } from "@/features/workspaces/lib/tones"
import type { Tone } from "@/features/workspaces/types"
import { homeRailRoles } from "../lib/rail-roles"
import type { DiscoveryRail } from "../types"

interface DiscoveryStatCardsProps {
  /** Home rails. */
  rails?: DiscoveryRail[]
  pinnedCount?: number
}

interface Stat {
  label: string
  value: number | string
  icon: LucideIcon
  tone: Tone
}

export function DiscoveryStatCards({
  rails = [],
  pinnedCount,
}: DiscoveryStatCardsProps) {
  const roles = [...homeRailRoles(rails).values()]
  const stats: Stat[] = [
    {
      label: "Live rails",
      value: rails.filter((rail) => rail.status === "live").length,
      icon: Sparkles,
      tone: "primary",
    },
    {
      label: "Featured rows",
      value: roles.filter((role) => role.kind === "row").length,
      icon: Layers,
      tone: "info",
    },
    {
      label: "Featured hero",
      value: roles.some((role) => role.kind === "hero") ? "Curated" : "Auto",
      icon: Star,
      tone: "warning",
    },
    {
      label: "For You pins",
      value: pinnedCount ?? "–",
      icon: Pin,
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
