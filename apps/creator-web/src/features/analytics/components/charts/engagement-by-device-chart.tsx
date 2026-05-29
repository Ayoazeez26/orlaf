import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
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
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import {
  ANALYTICS_CHART_AXIS_LINE,
  ANALYTICS_CHART_MARGIN,
  ANALYTICS_CHART_TICK,
  ANALYTICS_CHART_Y_AXIS_WIDTH,
  DEVICE_CHART_COLORS,
} from "../../constants"
import type { EngagementByDevicePoint } from "../../types"

interface EngagementByDeviceChartProps {
  data: EngagementByDevicePoint[]
  className?: string
}

export function EngagementByDeviceChart({
  data,
  className,
}: EngagementByDeviceChartProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="pb-4">
        <p className="font-semibold text-foreground">Engagement</p>
      </CardHeader>
      <CardContent className="h-[300px] pl-0 pr-1 sm:px-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={ANALYTICS_CHART_MARGIN} barGap={4}>
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
            <Bar
              dataKey="mobile"
              name="Mobile"
              fill={DEVICE_CHART_COLORS.mobile}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="desktop"
              name="Desktop"
              fill={DEVICE_CHART_COLORS.desktop}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="tablet"
              name="Tablet"
              fill={DEVICE_CHART_COLORS.tablet}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
