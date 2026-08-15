import { useParams } from "@tanstack/react-router"
import { AnalyticsMetricCard } from "@/features/analytics/components/shared/analytics-metric-card"
import { DEFAULT_ANALYTICS_DATE_RANGE } from "@/features/analytics/constants"
import { useAnalyticsDashboard } from "@/features/analytics/hooks/use-analytics-dashboard"
import { formatCompactCount } from "@/features/analytics/lib/map-analytics-overview"
import { ProjectAnalyticsSkeleton } from "@/features/dashboard/components/home/dashboard-home-skeleton"
import { useProject } from "../../hooks/use-project"
import { DevicesListCard } from "../analytics/devices-list-card"
import { ProjectViewershipTrendChart } from "../analytics/project-viewership-trend-chart"

export function ProjectAnalyticsTab() {
  const { projectId } = useParams({ strict: false })
  const { data: project } = useProject(projectId ?? "")
  const { data, isLoading, isError } = useAnalyticsDashboard(
    DEFAULT_ANALYTICS_DATE_RANGE,
    projectId
  )

  if (!project) return null

  if (isLoading) {
    return <ProjectAnalyticsSkeleton />
  }

  if (isError || !data) {
    return (
      <p className="text-destructive text-sm">
        Could not load analytics for this project.
      </p>
    )
  }

  const likes = data.engagement.reduce((sum, point) => sum + point.likes, 0)
  const shares = data.engagement.reduce((sum, point) => sum + point.shares, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.slice(0, 4).map((kpi) => (
          <AnalyticsMetricCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ProjectViewershipTrendChart
          data={data.viewershipTrend.map((point) => ({
            month: point.label,
            views: point.views,
            unique: point.unique,
          }))}
          className="lg:col-span-2"
        />
        <DevicesListCard data={data.devices} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.kpis[4] ? <AnalyticsMetricCard kpi={data.kpis[4]} /> : null}
        <AnalyticsMetricCard
          kpi={{
            label: "Likes",
            value: formatCompactCount(likes),
            icon: "likes",
          }}
        />
        <AnalyticsMetricCard
          kpi={{
            label: "Shares",
            value: formatCompactCount(shares),
            icon: "shares",
          }}
        />
      </div>
    </div>
  )
}
