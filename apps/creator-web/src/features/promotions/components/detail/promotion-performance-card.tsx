import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { cn } from "@workspace/ui/lib/utils"
import {
  Calendar,
  Layers,
  type LucideIcon,
  Megaphone,
  Target,
  User,
} from "lucide-react"
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
import {
  PROMOTION_AUDIENCE_OPTIONS,
  PROMOTION_GOAL_OPTIONS,
} from "../../constants"
import type {
  PromotionAudience,
  PromotionGoal,
  PromotionPerformancePoint,
} from "../../types"

const GOAL_LABELS = Object.fromEntries(
  PROMOTION_GOAL_OPTIONS.map((option) => [option.value, option.label])
) as Record<PromotionGoal, string>

const AUDIENCE_LABELS = Object.fromEntries(
  PROMOTION_AUDIENCE_OPTIONS.map((option) => [option.value, option.label])
) as Record<PromotionAudience, string>

interface PromotionPerformanceCardProps {
  data: PromotionPerformancePoint[]
  spent: number
  progressPercent: number
  projectName: string
  placement: string
  startDate: string
  endDate: string
  goal: PromotionGoal
  audience: PromotionAudience
  className?: string
}

interface DetailFieldProps {
  icon: LucideIcon
  label: string
  value: string
}

function DetailField({ icon: Icon, label, value }: DetailFieldProps) {
  return (
    <div className="flex items-start gap-3">
      <Icon
        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
        strokeWidth={1.75}
        aria-hidden
      />
      <div className="min-w-0 space-y-1">
        <p className="font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="font-medium text-foreground text-sm">{value}</p>
      </div>
    </div>
  )
}

export function PromotionPerformanceCard({
  data,
  spent,
  progressPercent,
  projectName,
  placement,
  startDate,
  endDate,
  goal,
  audience,
  className,
}: PromotionPerformanceCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="space-y-1 pb-4">
        <p className="font-semibold text-foreground">Performance</p>
        <p className="text-muted-foreground text-sm">
          Daily delivery over the past 14 days.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[260px] pr-1 pl-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={ANALYTICS_CHART_MARGIN}>
              <defs>
                <linearGradient
                  id="promotionPerformanceGradient"
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
                axisLine={ANALYTICS_CHART_AXIS_LINE}
                tickLine={ANALYTICS_CHART_AXIS_LINE}
                tick={ANALYTICS_CHART_TICK}
              />
              <YAxis
                width={ANALYTICS_CHART_Y_AXIS_WIDTH}
                axisLine={ANALYTICS_CHART_AXIS_LINE}
                tickLine={ANALYTICS_CHART_AXIS_LINE}
                tick={{ ...ANALYTICS_CHART_TICK, fontSize: 11 }}
                domain={[0, 1400]}
                ticks={[0, 350, 700, 1050, 1400]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                }}
                formatter={(value) => [value, "Impressions"]}
              />
              <Area
                type="monotone"
                dataKey="impressions"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#promotionPerformanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-1.5">
          <div className="flex w-full items-center justify-between">
            <span className="font-semibold font-space-grotesk text-foreground text-sm">
              ${spent}
            </span>
            <span className="text-muted-foreground text-sm">
              {progressPercent}%
            </span>
          </div>
          <Progress
            value={progressPercent}
            className="h-2.5 bg-primary/10 [&_[data-slot=progress-indicator]]:bg-primary"
          />
        </div>

        <div className="grid gap-6 border-border border-t pt-6 sm:grid-cols-2">
          <div className="space-y-5">
            <DetailField icon={Layers} label="Project" value={projectName} />
            <DetailField icon={Megaphone} label="Placement" value={placement} />
            <DetailField
              icon={Calendar}
              label="Schedule"
              value={`${startDate} → ${endDate}`}
            />
          </div>
          <div className="space-y-5">
            <DetailField icon={Target} label="Goal" value={GOAL_LABELS[goal]} />
            <DetailField
              icon={User}
              label="Audience"
              value={AUDIENCE_LABELS[audience]}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
