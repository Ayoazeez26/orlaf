import {
  Bar,
  BarChart,
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
import type { EngagementPoint } from "../../../types"

const ENGAGEMENT_COLORS = [
  ANALYTICS_SERIES_COLORS.primary,
  "#a78bfa",
  "#ddd6fe",
]

interface CreatorEngagementChartProps {
  data: EngagementPoint[]
}

export function CreatorEngagementChart({ data }: CreatorEngagementChartProps) {
  return (
    <ChartCard title="Engagement">
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={ANALYTICS_CHART_MARGIN}>
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
            <Legend
              verticalAlign="bottom"
              align="left"
              iconType="circle"
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
            <Bar
              dataKey="likes"
              name="Likes"
              fill={ENGAGEMENT_COLORS[0]}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="shares"
              name="Shares"
              fill={ENGAGEMENT_COLORS[1]}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="comments"
              name="Comments"
              fill={ENGAGEMENT_COLORS[2]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
