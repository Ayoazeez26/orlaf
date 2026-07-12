import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { FunnelStage } from "../../types"

interface ConversionFunnelCardProps {
  subtitle: string
  stages: FunnelStage[]
  className?: string
}

export function ConversionFunnelCard({
  subtitle,
  stages,
  className,
}: ConversionFunnelCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="pb-4">
        <p className="font-semibold text-foreground text-lg tracking-tight">
          Subscription conversion funnel
        </p>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-4">
          {stages.map((stage) => (
            <li key={stage.label} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground text-sm">
                    {stage.label}
                  </span>
                  {stage.dropPercent !== null ? (
                    <span className="font-medium text-trend-negative text-xs">
                      {stage.dropPercent.toFixed(1)}%
                    </span>
                  ) : null}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {stage.percentOfTop.toFixed(1)}%
                  </span>
                  <span className="font-semibold text-foreground text-sm tabular-nums">
                    {stage.count.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(Math.max(stage.percentOfTop, 0), 100)}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
