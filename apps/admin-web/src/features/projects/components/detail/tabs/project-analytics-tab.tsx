import { Clock, Eye, Percent, Play } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartCard } from "@/features/analytics/components/charts/chart-card"
import {
  ANALYTICS_CHART_AXIS_LINE,
  ANALYTICS_CHART_MARGIN,
  ANALYTICS_CHART_TICK,
  ANALYTICS_CHART_Y_AXIS_WIDTH,
  ANALYTICS_SERIES_COLORS,
  ANALYTICS_TOOLTIP_CONTENT_STYLE,
} from "@/features/analytics/constants"
import { useProjectAnalyticsQuery } from "@/features/projects/api/projects-hooks"
import { MetricCardsRow } from "@/features/workspaces/components/home/metric-cards-row"
import { AnalyticsTabSkeleton } from "@/features/workspaces/components/page-skeletons"
import type { MetricDef } from "@/features/workspaces/types"
import { ProjectTopEpisodesCard } from "../charts/project-top-episodes-card"

function formatWatchTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds))
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

interface ProjectAnalyticsTabProps {
  projectId: string
}

export function ProjectAnalyticsTab({ projectId }: ProjectAnalyticsTabProps) {
  const { data, isPending, isError } = useProjectAnalyticsQuery(projectId)

  if (isPending) {
    return <AnalyticsTabSkeleton />
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-[16px] border bg-surface-frosted p-6 text-center text-muted-foreground text-sm backdrop-blur-[24px]">
        Analytics data is not available yet.
      </div>
    )
  }

  const metrics: MetricDef[] = [
    {
      label: "Total Views",
      value: data.kpis.total_views.value.toLocaleString(),
      icon: Eye,
    },
    {
      label: "Unique Viewers",
      value: data.kpis.unique_viewers.value.toLocaleString(),
      icon: Play,
    },
    {
      label: "Avg. Watch Time",
      value: formatWatchTime(data.kpis.avg_watch_seconds.value),
      icon: Clock,
    },
    {
      label: "Completion",
      value: `${(data.kpis.completion_rate.value * 100).toFixed(1)}%`,
      icon: Percent,
    },
  ]

  const viewsThisWeek = data.viewership_trend.map((point) => ({
    day: point.label,
    views: point.views,
  }))

  const topEpisodes = data.top_episodes.map((episode) => ({
    rank: episode.rank,
    title: episode.episode_title,
    duration: "—",
    views: episode.views,
  }))

  return (
    <div className="space-y-6">
      <MetricCardsRow metrics={metrics} />

      <ChartCard title="Views">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={viewsThisWeek} margin={ANALYTICS_CHART_MARGIN}>
              <defs>
                <linearGradient
                  id="projectViewsFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={ANALYTICS_SERIES_COLORS.primary}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor={ANALYTICS_SERIES_COLORS.primary}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-border"
              />
              <XAxis
                dataKey="day"
                axisLine={ANALYTICS_CHART_AXIS_LINE}
                tickLine={ANALYTICS_CHART_AXIS_LINE}
                tick={ANALYTICS_CHART_TICK}
              />
              <YAxis
                width={ANALYTICS_CHART_Y_AXIS_WIDTH}
                axisLine={ANALYTICS_CHART_AXIS_LINE}
                tickLine={ANALYTICS_CHART_AXIS_LINE}
                tick={{ ...ANALYTICS_CHART_TICK, fontSize: 11 }}
              />
              <Tooltip contentStyle={ANALYTICS_TOOLTIP_CONTENT_STYLE} />
              <Area
                type="monotone"
                dataKey="views"
                name="Views"
                stroke={ANALYTICS_SERIES_COLORS.primary}
                strokeWidth={2}
                fill="url(#projectViewsFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ProjectTopEpisodesCard episodes={topEpisodes} />
    </div>
  )
}
