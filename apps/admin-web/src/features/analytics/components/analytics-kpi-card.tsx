import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { AnalyticsKpi } from "../types"

interface AnalyticsKpiCardProps {
  kpi: AnalyticsKpi
}

export function AnalyticsKpiCard({ kpi }: AnalyticsKpiCardProps) {
  const Icon = kpi.icon
  const hasChange = kpi.changePercent != null && !Number.isNaN(kpi.changePercent)
  const isPositive = (kpi.changePercent ?? 0) >= 0
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight
  const trendColor = isPositive ? "text-trend-positive" : "text-trend-negative"

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="flex flex-col gap-4 p-0 px-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
            {kpi.label}
          </span>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-5 text-primary" strokeWidth={2} aria-hidden />
          </span>
        </div>

        <p className="font-bold text-2xl text-foreground tracking-tight">
          {kpi.value}
        </p>

        {hasChange ? (
          <p className="flex flex-wrap items-center gap-1 text-sm">
            <TrendIcon
              className={cn("size-4 shrink-0", trendColor)}
              aria-hidden
            />
            <span className={cn("font-medium", trendColor)}>
              {isPositive ? "+" : "-"}
              {Math.abs(kpi.changePercent!).toFixed(1)}%
            </span>
            <span className="text-muted-foreground">vs last period</span>
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">No prior period</p>
        )}
      </CardContent>
    </Card>
  )
}
