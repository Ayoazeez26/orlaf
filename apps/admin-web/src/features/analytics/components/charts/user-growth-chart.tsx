import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  ANALYTICS_CHART_AXIS_LINE,
  ANALYTICS_CHART_MARGIN,
  ANALYTICS_CHART_TICK,
  ANALYTICS_CHART_Y_AXIS_WIDTH,
  ANALYTICS_SERIES_COLORS,
  ANALYTICS_TOOLTIP_CONTENT_STYLE,
} from "../../constants"
import type { UserGrowthPoint } from "../../types"
import { ChartCard } from "./chart-card"

interface UserGrowthChartProps {
  data: UserGrowthPoint[]
  className?: string
}

function formatCount(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : String(value)
}

export function UserGrowthChart({ data, className }: UserGrowthChartProps) {
  return (
    <ChartCard
      title="User growth"
      subtitle="Viewer activity and creators joining the platform"
      className={className}
    >
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={ANALYTICS_CHART_MARGIN}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-border"
            />
            <XAxis
              dataKey="week"
              axisLine={ANALYTICS_CHART_AXIS_LINE}
              tickLine={ANALYTICS_CHART_AXIS_LINE}
              tick={ANALYTICS_CHART_TICK}
            />
            <YAxis
              width={ANALYTICS_CHART_Y_AXIS_WIDTH}
              axisLine={ANALYTICS_CHART_AXIS_LINE}
              tickLine={ANALYTICS_CHART_AXIS_LINE}
              tick={{ ...ANALYTICS_CHART_TICK, fontSize: 11 }}
              tickFormatter={formatCount}
            />
            <Tooltip contentStyle={ANALYTICS_TOOLTIP_CONTENT_STYLE} />
            <Legend
              verticalAlign="bottom"
              align="left"
              iconType="circle"
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
            <Line
              type="monotone"
              dataKey="users"
              name="Users"
              stroke={ANALYTICS_SERIES_COLORS.primary}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="creators"
              name="Creators"
              stroke={ANALYTICS_SERIES_COLORS.amber}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
