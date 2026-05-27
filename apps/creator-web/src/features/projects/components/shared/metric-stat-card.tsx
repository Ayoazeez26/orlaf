import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Clock, DollarSign, Eye, TrendingUp, Users } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "../../constants/frosted-card"
import type { ProjectMetric } from "../../types"
import { GrowthBadge } from "./growth-badge"

const ICON_MAP = {
  views: Eye,
  revenue: DollarSign,
  subscribers: Users,
  watchTime: Clock,
  completion: TrendingUp,
} as const

interface MetricStatCardProps {
  metric: ProjectMetric
  className?: string
}

export function MetricStatCard({ metric, className }: MetricStatCardProps) {
  const Icon = ICON_MAP[metric.icon]

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardContent className="flex flex-col gap-4 p-0 px-6">
        <div className="flex items-start justify-between">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Icon className="size-5 text-primary" aria-hidden />
          </span>
          <GrowthBadge value={metric.change} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-bold text-2xl text-foreground tracking-tight">
            {metric.value}
          </span>
          <span className="text-muted-foreground text-sm">{metric.label}</span>
        </div>
      </CardContent>
    </Card>
  )
}
