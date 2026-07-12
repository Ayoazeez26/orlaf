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
import {
  ANALYTICS_CHART_AXIS_LINE,
  ANALYTICS_CHART_MARGIN,
  ANALYTICS_CHART_TICK,
  ANALYTICS_CHART_Y_AXIS_WIDTH,
  ANALYTICS_SERIES_COLORS,
  ANALYTICS_TOOLTIP_CONTENT_STYLE,
} from "../../constants"
import type { RevenuePoint } from "../../types"
import { ChartCard } from "./chart-card"

interface RevenueAnalyticsChartProps {
  data: RevenuePoint[]
  className?: string
}

function formatCurrency(value: number) {
  if (value === 0) return "$0"
  return `$${(value / 1000).toFixed(1)}K`
}

export function RevenueAnalyticsChart({
  data,
  className,
}: RevenueAnalyticsChartProps) {
  return (
    <ChartCard
      title="Revenue analytics"
      subtitle="Weekly revenue and subscription income"
      className={className}
    >
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={ANALYTICS_CHART_MARGIN}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
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
              <linearGradient
                id="subscriptionsFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={ANALYTICS_SERIES_COLORS.green}
                  stopOpacity={0.25}
                />
                <stop
                  offset="100%"
                  stopColor={ANALYTICS_SERIES_COLORS.green}
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
              tickFormatter={formatCurrency}
            />
            <Tooltip
              contentStyle={ANALYTICS_TOOLTIP_CONTENT_STYLE}
              formatter={(value) => formatCurrency(Number(value ?? 0))}
            />
            <Legend
              verticalAlign="bottom"
              align="left"
              iconType="circle"
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Total revenue"
              stroke={ANALYTICS_SERIES_COLORS.primary}
              strokeWidth={2}
              fill="url(#revenueFill)"
            />
            <Area
              type="monotone"
              dataKey="subscriptions"
              name="Subscriptions"
              stroke={ANALYTICS_SERIES_COLORS.green}
              strokeWidth={2}
              fill="url(#subscriptionsFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
