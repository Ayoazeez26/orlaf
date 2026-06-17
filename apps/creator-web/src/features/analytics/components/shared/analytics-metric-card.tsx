import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import {
  Banknote,
  Clock,
  DollarSign,
  Eye,
  LineChart,
  TrendingUp,
  Users,
} from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { AnalyticsKpi, AnalyticsKpiIcon } from "../../types"
import { TrendBadge } from "./trend-badge"

const ICON_MAP: Record<AnalyticsKpiIcon, typeof Eye> = {
  views: Eye,
  viewers: Users,
  watchTime: Clock,
  engagement: TrendingUp,
  dollar: DollarSign,
  chart: LineChart,
  clock: Clock,
  creditCard: Banknote,
}

interface AnalyticsMetricCardProps {
  kpi: AnalyticsKpi
  className?: string
}

export function AnalyticsMetricCard({
  kpi,
  className,
}: AnalyticsMetricCardProps) {
  const Icon = ICON_MAP[kpi.icon]

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardContent className="flex flex-col gap-4 p-0 px-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
            {kpi.label}
          </span>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-5 text-primary" strokeWidth={2} aria-hidden />
          </span>
        </div>

        <p className="font-bold font-space-grotesk text-2xl text-foreground tracking-tight">
          {kpi.value}
        </p>

        {kpi.footnote ? (
          <p className="font-medium text-sm text-trend-positive">
            {kpi.footnote}
          </p>
        ) : kpi.changePercent !== undefined ? (
          <TrendBadge changePercent={kpi.changePercent} variant="inline" />
        ) : null}
      </CardContent>
    </Card>
  )
}
