import { useParams } from "@tanstack/react-router"
import { AnalyticsMetricCard } from "@/features/analytics/components/shared/analytics-metric-card"
import { useProject } from "../../hooks/use-project"
import { AudienceRetentionChart } from "../analytics/audience-retention-chart"
import { DevicesListCard } from "../analytics/devices-list-card"
import { ProjectViewershipTrendChart } from "../analytics/project-viewership-trend-chart"
import { TrafficSourcesCard } from "../analytics/traffic-sources-card"

export function ProjectAnalyticsTab() {
  const { projectId } = useParams({ strict: false })
  const { data: project } = useProject(projectId ?? "")

  if (!project) return null

  const { analytics } = project

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {analytics.kpis.map((kpi) => (
          <AnalyticsMetricCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ProjectViewershipTrendChart
          data={analytics.viewershipTrend}
          className="lg:col-span-2"
        />
        <DevicesListCard data={analytics.devices} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AudienceRetentionChart
          data={analytics.audienceRetention}
          className="lg:col-span-2"
        />
        <TrafficSourcesCard data={analytics.trafficSources} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {analytics.engagementKpis.map((kpi) => (
          <AnalyticsMetricCard key={kpi.label} kpi={kpi} />
        ))}
      </div>
    </div>
  )
}
