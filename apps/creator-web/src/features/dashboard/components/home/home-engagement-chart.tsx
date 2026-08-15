import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
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
} from "@/features/analytics/constants"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { DashboardEngagementPoint } from "../../types"

const ENGAGEMENT_COLORS = {
  primary: "var(--primary)",
  secondary: "color-mix(in oklch, var(--primary) 65%, white)",
  tertiary: "color-mix(in oklch, var(--primary) 35%, white)",
}

interface HomeEngagementChartProps {
  data: DashboardEngagementPoint[]
  className?: string
}

export function HomeEngagementChart({
  data,
  className,
}: HomeEngagementChartProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="pb-4">
        <p className="font-semibold text-foreground">Engagement</p>
      </CardHeader>
      <CardContent className="h-[280px] pr-1 pl-0 sm:px-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={ANALYTICS_CHART_MARGIN} barGap={4}>
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
            <Bar
              dataKey="primary"
              name="Views"
              fill={ENGAGEMENT_COLORS.primary}
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="secondary"
              name="Likes"
              fill={ENGAGEMENT_COLORS.secondary}
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="tertiary"
              name="Shares"
              fill={ENGAGEMENT_COLORS.tertiary}
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
