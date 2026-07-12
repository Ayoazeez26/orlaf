import { Badge } from "@workspace/ui/components/badge"
import { Repeat } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
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
import type { RetentionPoint } from "../../types"
import { ChartCard } from "./chart-card"

interface RetentionChartProps {
  data: RetentionPoint[]
  badge: string
  className?: string
}

export function RetentionChart({
  data,
  badge,
  className,
}: RetentionChartProps) {
  return (
    <ChartCard
      title="Retention"
      subtitle="% of users still active after sign-up"
      className={className}
      action={
        <Badge
          variant="secondary"
          className="gap-1 rounded-full bg-primary/10 font-medium text-primary"
        >
          <Repeat className="size-3" aria-hidden />
          {badge}
        </Badge>
      }
    >
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={ANALYTICS_CHART_MARGIN}>
            <defs>
              <linearGradient id="retentionFill" x1="0" y1="0" x2="0" y2="1">
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
              domain={[0, 100]}
              axisLine={ANALYTICS_CHART_AXIS_LINE}
              tickLine={ANALYTICS_CHART_AXIS_LINE}
              tick={{ ...ANALYTICS_CHART_TICK, fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={ANALYTICS_TOOLTIP_CONTENT_STYLE}
              formatter={(value) => [`${Number(value ?? 0)}%`, "Retention"]}
            />
            <Area
              type="monotone"
              dataKey="retention"
              name="Retention"
              stroke={ANALYTICS_SERIES_COLORS.primary}
              strokeWidth={2}
              fill="url(#retentionFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
