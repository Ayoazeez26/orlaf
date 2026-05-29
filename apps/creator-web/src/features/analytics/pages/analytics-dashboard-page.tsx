import { AnalyticsPageHeader } from "../components/analytics-page-header"
import { AnalyticsPageSkeleton } from "../components/analytics-page-skeleton"
import { DevicesDonutChart } from "../components/charts/devices-donut-chart"
import { EngagementByDeviceChart } from "../components/charts/engagement-by-device-chart"
import { ViewershipTrendChart } from "../components/charts/viewership-trend-chart"
import { AnalyticsMetricCard } from "../components/shared/analytics-metric-card"
import { TopEpisodesList } from "../components/top-episodes-list"
import { useAnalyticsDashboard } from "../hooks/use-analytics-dashboard"

export function AnalyticsDashboardPage() {
  const { data, isLoading, isError } = useAnalyticsDashboard()

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <AnalyticsPageHeader />

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
            <EngagementByDeviceChart
              data={data.engagementByDevice}
              className="lg:col-span-2"
            />
            <TopEpisodesList episodes={data.topEpisodes} />
          </div>
        </>
      )}
    </div>
  )
}
