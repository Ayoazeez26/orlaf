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
  ANALYTICS_CHART_MARGIN,
  ANALYTICS_CHART_Y_AXIS_WIDTH,
} from "@/features/analytics/constants"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { WeeklyViewPoint } from "@/features/projects/types"

interface WeeklyViewsChartProps {
  data: WeeklyViewPoint[]
  title?: string
  className?: string
}

export function WeeklyViewsChart({
  data,
  title = "Views This Week",
  className,
}: WeeklyViewsChartProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="pb-4">
        <p className="font-semibold text-foreground text-sm">{title}</p>
      </CardHeader>
      <CardContent className="h-[280px] pl-0 pr-1 sm:px-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={ANALYTICS_CHART_MARGIN}>
            <defs>
              <linearGradient
                id="weeklyViewsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
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
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              width={ANALYTICS_CHART_Y_AXIS_WIDTH}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
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
            <Area
              type="monotone"
              dataKey="views"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#weeklyViewsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
