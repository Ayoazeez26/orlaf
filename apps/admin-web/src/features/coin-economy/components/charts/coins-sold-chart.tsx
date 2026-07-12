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
import { ChartCard } from "@/features/analytics/components/charts/chart-card"
import {
  ANALYTICS_CHART_AXIS_LINE,
  ANALYTICS_CHART_MARGIN,
  ANALYTICS_CHART_TICK,
  ANALYTICS_CHART_Y_AXIS_WIDTH,
  ANALYTICS_SERIES_COLORS,
  ANALYTICS_TOOLTIP_CONTENT_STYLE,
} from "@/features/analytics/constants"
import { COINS_SOLD_CHANGE_PERCENT } from "../../constants"
import type { CoinsSoldPoint } from "../../types"

interface CoinsSoldChartProps {
  data: CoinsSoldPoint[]
  className?: string
}

export function CoinsSoldChart({ data, className }: CoinsSoldChartProps) {
  return (
    <ChartCard
      title="Coins sold"
      subtitle="Last 6 months, in millions"
      className={className}
      action={
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 font-medium text-emerald-600 text-xs">
          <ArrowUpRight className="size-3.5" aria-hidden />+
          {COINS_SOLD_CHANGE_PERCENT.toFixed(1)}%
        </span>
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
            />
            <Tooltip
              contentStyle={ANALYTICS_TOOLTIP_CONTENT_STYLE}
              formatter={(value) => `${Number(value ?? 0).toFixed(1)}M`}
            />
            <Bar
              dataKey="amount"
              name="Coins sold"
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
