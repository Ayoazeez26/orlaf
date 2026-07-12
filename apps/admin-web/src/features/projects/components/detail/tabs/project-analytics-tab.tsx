import { Clock, DollarSign, Eye, Users } from "lucide-react"
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
import { MetricCardsRow } from "@/features/workspaces/components/home/metric-cards-row"
import type { MetricDef } from "@/features/workspaces/types"
import { formatProjectSubscribers } from "../../../data/project-details"
import type { ProjectAnalytics } from "../../../types"
import { ProjectTopEpisodesCard } from "../charts/project-top-episodes-card"

interface ProjectAnalyticsTabProps {
  analytics: ProjectAnalytics
}

export function ProjectAnalyticsTab({ analytics }: ProjectAnalyticsTabProps) {
  const metrics: MetricDef[] = [
    {
      label: "Total Views",
      value: analytics.totalViews.toLocaleString(),
      icon: Eye,
    },
    {
      label: "Revenue",
      value: analytics.revenue.toLocaleString(),
      icon: DollarSign,
    },
    {
      label: "Subscribers",
      value: formatProjectSubscribers(analytics.subscribers),
      icon: Users,
    },
    {
      label: "Avg. Watch Time",
      value: analytics.avgWatchTime,
      icon: Clock,
    },
  ]

  return (
    <div className="space-y-6">
      <MetricCardsRow metrics={metrics} />

      <ChartCard title="Views This Week">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={analytics.viewsThisWeek}
              margin={ANALYTICS_CHART_MARGIN}
            >
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

      <ProjectTopEpisodesCard episodes={analytics.topEpisodes} />
    </div>
  )
}
