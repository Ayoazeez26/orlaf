import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { TONE_CHIP_CLASS } from "@/features/workspaces/lib/tones"
import type { Tone } from "@/features/workspaces/types"
import { SUBSCRIPTION_SUMMARY_STATS } from "../data/subscription-analytics"
import type { SubscriptionSummaryStat } from "../types"

const STAT_TONES: Tone[] = ["primary", "primary", "positive", "warning"]

export function SubscriptionsStatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {SUBSCRIPTION_SUMMARY_STATS.map((stat, index) => (
        <StatCard
          key={stat.label}
          stat={stat}
          tone={STAT_TONES[index] ?? "primary"}
        />
      ))}
    </div>
  )
}

function StatCard({
  stat,
  tone,
}: {
  stat: SubscriptionSummaryStat
  tone: Tone
}) {
  const Icon = stat.icon

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-5")}>
      <CardContent className="flex items-center gap-4 p-0 px-5">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            TONE_CHIP_CLASS[tone]
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
}
