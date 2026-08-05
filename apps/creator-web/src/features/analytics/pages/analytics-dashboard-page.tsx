import { useState } from "react"
import { AnalyticsPageHeader } from "../components/analytics-page-header"
import { AnalyticsPageSkeleton } from "../components/analytics-page-skeleton"
import { DevicesDonutChart } from "../components/charts/devices-donut-chart"
import { EngagementChart } from "../components/charts/engagement-chart"
import { ViewershipTrendChart } from "../components/charts/viewership-trend-chart"
import { AnalyticsMetricCard } from "../components/shared/analytics-metric-card"
import { TopEpisodesList } from "../components/top-episodes-list"
import { DEFAULT_ANALYTICS_DATE_RANGE } from "../constants"
import { useAnalyticsDashboard } from "../hooks/use-analytics-dashboard"
import type { AnalyticsDateRangeLabel } from "../types"

export function AnalyticsDashboardPage() {
  const [period, setPeriod] = useState<AnalyticsDateRangeLabel>(
    DEFAULT_ANALYTICS_DATE_RANGE
  )
  const { data, isLoading, isError } = useAnalyticsDashboard(period)

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <AnalyticsPageHeader period={period} onPeriodChange={setPeriod} />

      {isLoading && <AnalyticsPageSkeleton />}

      {isError && (
        <p className="text-destructive text-sm">
          Could not load analytics. Please try again.
        </p>
      )}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.kpis.map((kpi) => (
              <AnalyticsMetricCard key={kpi.label} kpi={kpi} />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <ViewershipTrendChart
              data={data.viewershipTrend}
              className="lg:col-span-2"
            />
            <DevicesDonutChart data={data.devices} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <EngagementChart data={data.engagement} className="lg:col-span-2" />
            <TopEpisodesList episodes={data.topEpisodes} />
          </div>
        </>
      )}
    </div>
  )
}
