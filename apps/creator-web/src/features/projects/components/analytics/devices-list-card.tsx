import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { DEVICE_CHART_COLORS } from "@/features/analytics/constants"
import type { DeviceSegment } from "@/features/analytics/types"
import { FROSTED_CARD_SURFACE_CLASS } from "../../constants/frosted-card"

const DEVICE_KEYS = ["mobile", "desktop", "tablet"] as const

interface DevicesListCardProps {
  data: DeviceSegment[]
  className?: string
}

export function DevicesListCard({ data, className }: DevicesListCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="pb-4">
        <p className="font-semibold text-foreground">Devices</p>
      </CardHeader>
      <CardContent className="space-y-5 px-6">
        {data.map((segment, index) => (
          <div
            key={segment.name}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{
                  background:
                    DEVICE_CHART_COLORS[DEVICE_KEYS[index] ?? "mobile"],
                }}
                aria-hidden
              />
              <span className="font-medium text-foreground text-sm">
                {segment.name}
              </span>
            </div>
            <span className="shrink-0 font-semibold text-foreground text-sm">
              {segment.percent}%
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
