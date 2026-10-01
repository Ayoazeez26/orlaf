import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Coins, Gift, ShoppingBag, TrendingUp } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { TONE_CHIP_CLASS } from "@/features/workspaces/lib/tones"
import type { Tone } from "@/features/workspaces/types"
import { useAdminEconomyStats } from "../api/coin-economy-hooks"
import { formatCoinCount } from "../lib/map-admin-purchase"

export function CoinEconomyStatCards() {
  const { data: stats, isLoading } = useAdminEconomyStats()

  const cards: {
    label: string
    value: string
    icon: typeof Coins
    tone: Tone
  }[] = [
    {
      label: "Coins in circulation",
      value: isLoading
        ? "—"
        : formatCoinCount(stats?.coins_in_circulation ?? 0),
      icon: Coins,
      tone: "primary",
    },
    {
      label: "Coins sold (30d)",
      value: isLoading ? "—" : formatCoinCount(stats?.coins_sold_30d ?? 0),
      icon: TrendingUp,
      tone: "primary",
    },
    {
      label: "Coins spent (30d)",
      value: isLoading ? "—" : formatCoinCount(stats?.coins_spent_30d ?? 0),
      icon: Gift,
      tone: "primary",
    },
    {
      label: "Purchases (30d)",
      value: isLoading
        ? "—"
        : (stats?.purchases_30d ?? 0).toLocaleString("en-US"),
      icon: ShoppingBag,
      tone: "primary",
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
