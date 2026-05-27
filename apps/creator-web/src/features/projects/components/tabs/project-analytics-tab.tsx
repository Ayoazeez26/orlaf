import { useParams } from "@tanstack/react-router"
import { WeeklyViewsChart } from "@/features/analytics/components/charts/weekly-views-chart"
import { useProject } from "../../hooks/use-project"
import { MetricStatCard } from "../shared/metric-stat-card"

export function ProjectAnalyticsTab() {
  const { projectId } = useParams({ strict: false })
  const { data: project } = useProject(projectId ?? "")

  if (!project) return null

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {project.analyticsMetrics.map((metric) => (
          <MetricStatCard key={metric.label} metric={metric} />
        ))}
      </div>
      <WeeklyViewsChart data={project.weeklyViews} />
    </div>
  )
}
