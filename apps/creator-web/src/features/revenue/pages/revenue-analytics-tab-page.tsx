import { AnalyticsMetricCard } from "@/features/analytics/components/shared/analytics-metric-card"
import { RevenueBySourceCard } from "../components/analytics-tab/revenue-by-source-card"
import { useRevenueDashboard } from "../hooks/use-revenue-dashboard"

export function RevenueAnalyticsTabPage() {
  const { data } = useRevenueDashboard()

  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.analyticsKpis.map((kpi) => (
          <AnalyticsMetricCard key={kpi.label} kpi={kpi} />
        ))}
      </div>
      <RevenueBySourceCard items={data.revenueBySource} />
    </div>
  )
}
