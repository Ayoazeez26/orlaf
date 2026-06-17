import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
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
} from "@/features/analytics/constants"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { EarningsOverTimePoint } from "../../types"

interface EarningsOverTimeChartProps {
  data: EarningsOverTimePoint[]
  className?: string
}

export function EarningsOverTimeChart({
  data,
  className,
}: EarningsOverTimeChartProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="pb-4">
        <p className="font-semibold text-foreground">Earnings Over Time</p>
      </CardHeader>
      <CardContent className="h-[300px] pr-1 pl-0 sm:px-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={ANALYTICS_CHART_MARGIN}>
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--primary)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor="var(--primary)"
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
              tickFormatter={(v) =>
                v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${v}`
              }
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--card)",
              }}
              formatter={(value) => [`$${value}`, "Earnings"]}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#earningsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
