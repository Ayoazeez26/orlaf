import { ArrowUpRight } from "lucide-react"
import {
  Bar,
  BarChart,
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
} from "@/features/analytics/constants"
import { formatNaira } from "@/features/payouts/lib/format-naira"
import type { MrrTrendPoint } from "../../types"
import { ChartCard } from "./chart-card"

interface MrrTrendChartProps {
  data: MrrTrendPoint[]
  changePercent?: number
  className?: string
}

function formatAxisValue(value: number) {
  return `₦${(value / 1_000_000).toFixed(0)}M`
}

export function MrrTrendChart({
  data,
  changePercent = 0,
  className,
}: MrrTrendChartProps) {
  const trendPositive = changePercent >= 0

  return (
    <ChartCard
      title="MRR trend"
      subtitle="Estimated from active VIP SKUs (last 6 months)"
      className={className}
      action={
        data.length > 1 ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium text-xs ${
              trendPositive
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            <ArrowUpRight className="size-3.5" aria-hidden />
            {trendPositive ? "+" : ""}
            {changePercent.toFixed(1)}%
          </span>
        ) : null
      }
    >
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={ANALYTICS_CHART_MARGIN}>
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
              tickFormatter={formatAxisValue}
            />
            <Tooltip
              contentStyle={ANALYTICS_TOOLTIP_CONTENT_STYLE}
              formatter={(value) => formatNaira(Number(value ?? 0))}
            />
            <Bar
              dataKey="amount"
              name="MRR"
              fill={ANALYTICS_SERIES_COLORS.primary}
              fillOpacity={0.85}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
