import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { type Coins, Download, Link2, TrendingUp, Wallet } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { TONE_CHIP_CLASS } from "@/features/workspaces/lib/tones"
import type { Tone } from "@/features/workspaces/types"

const STATS: {
  label: string
  value: string
  icon: typeof Coins
  tone: Tone
}[] = [
  {
    label: "Coins in circulation",
    value: "48.2M",
    icon: Link2,
    tone: "primary",
  },
  {
    label: "Coins sold (30d)",
    value: "6.4M",
    icon: TrendingUp,
    tone: "primary",
  },
  {
    label: "Coin revenue (30d)",
    value: "₦28.1M",
    icon: Wallet,
    tone: "primary",
  },
  {
    label: "Creator cash-outs",
    value: "₦9.7M",
    icon: Download,
    tone: "primary",
  },
]

export function CoinEconomyStatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map((stat) => {
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
