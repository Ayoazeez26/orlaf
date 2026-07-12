import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { AlertTriangle, CheckCircle2, Clock, Wallet } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { TONE_CHIP_CLASS } from "@/features/workspaces/lib/tones"
import type { Tone } from "@/features/workspaces/types"
import type { PayoutSummaryStat } from "../types"

const STATS: { stat: PayoutSummaryStat; tone: Tone }[] = [
  {
    stat: { label: "Paid (30d)", value: "₦42.6M", icon: Wallet },
    tone: "primary",
  },
  {
    stat: { label: "Pending this cycle", value: "₦8.9M", icon: Clock },
    tone: "warning",
  },
  {
    stat: { label: "Creators paid (30d)", value: "1,284", icon: CheckCircle2 },
    tone: "positive",
  },
  {
    stat: { label: "On hold", value: "17", icon: AlertTriangle },
    tone: "danger",
  },
]

export function PayoutsStatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map(({ stat, tone }) => {
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
      })}
    </div>
  )
}
