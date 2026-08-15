import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
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
import type { ViewershipPoint } from "../../../types"

interface CreatorViewershipChartProps {
  data: ViewershipPoint[]
}

export function CreatorViewershipChart({ data }: CreatorViewershipChartProps) {
  return (
    <ChartCard title="Viewership Trend">
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={ANALYTICS_CHART_MARGIN}>
            <defs>
              <linearGradient id="creatorViewsFill" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="month"
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
            <Legend
              verticalAlign="bottom"
              align="left"
              iconType="circle"
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
            <Area
              type="monotone"
              dataKey="views"
              name="Views"
              stroke={ANALYTICS_SERIES_COLORS.primary}
              strokeWidth={2}
              fill="url(#creatorViewsFill)"
            />
            <Area
              type="monotone"
              dataKey="previous"
              name="Unique viewers"
              stroke={ANALYTICS_SERIES_COLORS.amber}
              strokeWidth={2}
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
