import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { DEVICE_CHART_COLORS } from "@/features/analytics/constants"
import { FROSTED_CARD_SURFACE_CLASS } from "../../constants/frosted-card"
import type { TrafficSourceRow } from "../../types"

const TRAFFIC_SOURCE_COLORS = [
  DEVICE_CHART_COLORS.mobile,
  DEVICE_CHART_COLORS.desktop,
  DEVICE_CHART_COLORS.tablet,
  "#5BB5C9",
] as const

interface TrafficSourcesCardProps {
  data: TrafficSourceRow[]
  className?: string
}

export function TrafficSourcesCard({
  data,
  className,
}: TrafficSourcesCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="pb-4">
        <p className="font-semibold text-foreground">Traffic sources</p>
      </CardHeader>
      <CardContent className="space-y-5 px-6">
        {data.map((source, index) => (
          <div key={source.name} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-foreground text-sm">
                {source.name}
              </span>
              <span className="font-semibold text-foreground text-sm">
                {source.percent}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted/60">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${source.percent}%`,
                  backgroundColor:
                    TRAFFIC_SOURCE_COLORS[index % TRAFFIC_SOURCE_COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
