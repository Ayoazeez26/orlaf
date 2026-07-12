import { AnalyticsMetricCard } from "@/features/analytics/components/shared/analytics-metric-card"
import type { AnalyticsKpi } from "@/features/analytics/types"

interface MetricCardsRowProps {
  kpis: AnalyticsKpi[]
}

export function MetricCardsRow({ kpis }: MetricCardsRowProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <AnalyticsMetricCard key={kpi.label} kpi={kpi} showTrend={false} />
      ))}
    </div>
  )
}
