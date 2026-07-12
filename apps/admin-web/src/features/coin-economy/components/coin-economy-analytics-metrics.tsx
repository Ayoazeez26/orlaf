import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { CoinAnalyticsMetric } from "../types"

interface CoinEconomyAnalyticsMetricsProps {
  metrics: CoinAnalyticsMetric[]
}

function isTrendPositive(metric: CoinAnalyticsMetric) {
  const increased = metric.changePercent >= 0
  return metric.increaseIsGood ? increased : !increased
}

export function CoinEconomyAnalyticsMetrics({
  metrics,
}: CoinEconomyAnalyticsMetricsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const positive = isTrendPositive(metric)
        const TrendIcon =
          metric.changePercent >= 0 ? ArrowUpRight : ArrowDownRight
        const trendColor = positive
          ? "text-trend-positive"
          : "text-trend-negative"

        return (
          <Card
            key={metric.label}
            className={cn(FROSTED_CARD_SURFACE_CLASS, "py-5")}
          >
            <CardContent className="space-y-2 p-0 px-5">
              <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                {metric.label}
              </p>
              <p className="font-bold text-2xl text-foreground tracking-tight">
                {metric.value}
              </p>
              <p className="flex items-center gap-1 text-sm">
                <TrendIcon
                  className={cn("size-4 shrink-0", trendColor)}
                  aria-hidden
                />
                <span className={cn("font-medium", trendColor)}>
                  {metric.changePercent >= 0 ? "+" : ""}
                  {metric.changePercent.toFixed(1)}%
                </span>
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
