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
import type { WatchHoursPoint } from "../../../types"

interface StreamerWatchHoursChartProps {
  data: WatchHoursPoint[]
}

export function StreamerWatchHoursChart({
  data,
}: StreamerWatchHoursChartProps) {
  return (
    <ChartCard
      title="Watch hours · last 12 weeks"
      subtitle="Hours streamed per ISO week"
      action={
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-medium text-emerald-600 text-xs">
          <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
          Active
        </span>
      }
    >
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={ANALYTICS_CHART_MARGIN}>
            <defs>
              <linearGradient
                id="streamerWatchHoursFill"
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
            />
            <Tooltip contentStyle={ANALYTICS_TOOLTIP_CONTENT_STYLE} />
            <Area
              type="monotone"
              dataKey="hours"
              name="Watch hours"
              stroke={ANALYTICS_SERIES_COLORS.primary}
              strokeWidth={2}
              fill="url(#streamerWatchHoursFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
