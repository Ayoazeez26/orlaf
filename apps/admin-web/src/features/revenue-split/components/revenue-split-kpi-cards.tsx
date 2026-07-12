import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { RevenueSplitKpi } from "../types"

interface RevenueSplitKpiCardsProps {
  kpis: RevenueSplitKpi[]
}

export function RevenueSplitKpiCards({ kpis }: RevenueSplitKpiCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        const hasTrend = kpi.changePercent !== undefined
        const isPositive = (kpi.changePercent ?? 0) >= 0
        const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight
        const trendColor = isPositive
          ? "text-trend-positive"
          : "text-trend-negative"

        return (
          <Card
            key={kpi.label}
            className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}
          >
            <CardContent className="flex flex-col gap-4 p-0 px-6">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  {kpi.label}
                </span>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon
                    className="size-5 text-primary"
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>
              </div>

              <p className="font-bold text-2xl text-foreground tracking-tight">
                {kpi.value}
              </p>

              {hasTrend ? (
                <p className="flex flex-wrap items-center gap-1 text-sm">
                  <TrendIcon
                    className={cn("size-4 shrink-0", trendColor)}
                    aria-hidden
                  />
                  <span className={cn("font-medium", trendColor)}>
                    {isPositive ? "+" : "-"}
                    {Math.abs(kpi.changePercent ?? 0).toFixed(1)}%
                  </span>
                  <span className="text-muted-foreground">vs last period</span>
                </p>
              ) : null}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
