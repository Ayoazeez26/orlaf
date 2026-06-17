import { AnalyticsMetricCard } from "@/features/analytics/components/shared/analytics-metric-card"
import { RevenueBySourceCard } from "../components/analytics-tab/revenue-by-source-card"
import { EarningsOverTimeChart } from "../components/overview/earnings-over-time-chart"
import { RevenueBreakdownCard } from "../components/overview/revenue-breakdown-card"
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
      <div className="grid gap-4 lg:grid-cols-3">
        <EarningsOverTimeChart
          data={data.earningsOverTime}
          className="lg:col-span-2"
        />
        <RevenueBreakdownCard items={data.revenueBreakdown} />
      </div>
      <RevenueBySourceCard items={data.revenueBySource} />
    </div>
  )
}
