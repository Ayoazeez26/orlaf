import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
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
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import {
  ANALYTICS_CHART_AXIS_LINE,
  ANALYTICS_CHART_MARGIN,
  ANALYTICS_CHART_TICK,
  ANALYTICS_CHART_Y_AXIS_WIDTH,
  DEVICE_CHART_COLORS,
} from "../../constants"
import type { ViewershipTrendPoint } from "../../types"

interface ViewershipTrendChartProps {
  data: ViewershipTrendPoint[]
  className?: string
}

export function ViewershipTrendChart({
  data,
  className,
}: ViewershipTrendChartProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="pb-4">
        <p className="font-semibold text-foreground">Viewership Trend</p>
      </CardHeader>
      <CardContent className="h-[300px] pr-1 pl-0 sm:px-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={ANALYTICS_CHART_MARGIN}>
            <defs>
              <linearGradient id="mobileTrendFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={DEVICE_CHART_COLORS.mobile}
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor={DEVICE_CHART_COLORS.mobile}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="desktopTrendFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={DEVICE_CHART_COLORS.desktop}
                  stopOpacity={0.25}
                />
                <stop
                  offset="100%"
                  stopColor={DEVICE_CHART_COLORS.desktop}
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
                v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)
              }
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--card)",
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
            />
            <Area
              type="monotone"
              dataKey="mobile"
              name="Mobile"
              stroke={DEVICE_CHART_COLORS.mobile}
              strokeWidth={2}
              fill="url(#mobileTrendFill)"
            />
            <Area
              type="monotone"
              dataKey="desktop"
              name="Desktop"
              stroke={DEVICE_CHART_COLORS.desktop}
              strokeWidth={2}
              fill="url(#desktopTrendFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
