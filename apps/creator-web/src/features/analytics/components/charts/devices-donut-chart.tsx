import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Monitor, Smartphone, Tablet } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import {
  ANALYTICS_DONUT_SEGMENT_STROKE,
  DEVICE_CHART_COLORS,
} from "../../constants"
import type { DeviceSegment } from "../../types"

const DEVICE_KEYS = ["mobile", "desktop", "tablet"] as const
type DeviceKey = (typeof DEVICE_KEYS)[number]

const DEVICE_ICONS: Record<DeviceKey, typeof Smartphone> = {
  mobile: Smartphone,
  desktop: Monitor,
  tablet: Tablet,
}

interface DevicesDonutChartProps {
  data: DeviceSegment[]
  className?: string
}

function DeviceLegendItem({
  segment,
  deviceKey,
}: {
  segment: DeviceSegment
  deviceKey: DeviceKey
}) {
  const Icon = DEVICE_ICONS[deviceKey]

  return (
    <div className="flex items-center gap-2">
      <span
        className="size-2.5 shrink-0 rounded-full"
        style={{ background: DEVICE_CHART_COLORS[deviceKey] }}
        aria-hidden
      />
      <Icon
        className="size-4 shrink-0 text-foreground"
        strokeWidth={1.75}
        aria-hidden
      />
      <span className="font-medium text-foreground text-sm">
        {segment.name}
      </span>
      <span className="text-muted-foreground text-sm">{segment.percent}%</span>
    </div>
  )
}

export function DevicesDonutChart({ data, className }: DevicesDonutChartProps) {
  const byKey = (key: DeviceKey) => {
    const index = DEVICE_KEYS.indexOf(key)
    const segment = data[index]
    if (!segment) return null
    return { segment, deviceKey: key }
  }

  const mobile = byKey("mobile")
  const desktop = byKey("desktop")
  const tablet = byKey("tablet")

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="pb-4">
        <p className="font-semibold text-foreground">Devices</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="82%"
                paddingAngle={2}
                stroke={ANALYTICS_DONUT_SEGMENT_STROKE}
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={DEVICE_CHART_COLORS[DEVICE_KEYS[index] ?? "mobile"]}
                    stroke={ANALYTICS_DONUT_SEGMENT_STROKE}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                }}
                formatter={(value) => [`${value}%`, "Share"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-4 px-2">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {mobile && (
              <DeviceLegendItem
                segment={mobile.segment}
                deviceKey={mobile.deviceKey}
              />
            )}
            {desktop && (
              <DeviceLegendItem
                segment={desktop.segment}
                deviceKey={desktop.deviceKey}
              />
            )}
          </div>
          {tablet && (
            <div className="flex justify-center">
              <DeviceLegendItem
                segment={tablet.segment}
                deviceKey={tablet.deviceKey}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
