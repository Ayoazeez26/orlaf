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
import { FROSTED_CARD_SURFACE_CLASS } from "../../constants/frosted-card"
import type { WeeklyViewPoint } from "../../types"

interface ViewsThisWeekChartProps {
  data: WeeklyViewPoint[]
}

export function ViewsThisWeekChart({ data }: ViewsThisWeekChartProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardHeader className="pb-4">
        <p className="font-semibold text-foreground text-sm">Views This Week</p>
      </CardHeader>
      <CardContent className="h-[280px] px-2 sm:px-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
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
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
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
              fill="url(#viewsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
