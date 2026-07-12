import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { ChartCard } from "@/features/analytics/components/charts/chart-card"
import {
  ANALYTICS_SERIES_COLORS,
  ANALYTICS_TOOLTIP_CONTENT_STYLE,
} from "@/features/analytics/constants"
import type { DeviceShare } from "../../../types"

const DEVICE_COLORS = [ANALYTICS_SERIES_COLORS.primary, "#a78bfa", "#ddd6fe"]

interface CreatorDevicesChartProps {
  data: DeviceShare[]
}

export function CreatorDevicesChart({ data }: CreatorDevicesChartProps) {
  return (
    <ChartCard title="Devices">
      <div className="flex flex-col items-center gap-4">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={ANALYTICS_TOOLTIP_CONTENT_STYLE}
                formatter={(value) => [`${Number(value ?? 0)}%`, "Share"]}
              />
              <Pie
                data={data}
                dataKey="share"
                nameKey="device"
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={80}
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.device}
                    fill={DEVICE_COLORS[index % DEVICE_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {data.map((entry, index) => (
            <div
              key={entry.device}
              className="flex items-center gap-2 text-muted-foreground text-sm"
            >
              <span
                className="size-2.5 rounded-full"
                style={{
                  backgroundColor: DEVICE_COLORS[index % DEVICE_COLORS.length],
                }}
                aria-hidden
              />
              {entry.device} ({entry.share}%)
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  )
}
