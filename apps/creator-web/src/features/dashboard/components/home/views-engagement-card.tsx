import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"
import { DATE_RANGE_SELECT_TRIGGER_CLASS } from "@/features/analytics/constants"
import type { DashboardMetrics } from "../../types"

const PERIOD_OPTIONS = ["Last 7 days", "Last 30 days", "Last 90 days"]

interface ViewsEngagementCardProps {
  metrics: DashboardMetrics
}

export function ViewsEngagementCard({ metrics }: ViewsEngagementCardProps) {
  const [period, setPeriod] = useState(metrics.period)

  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-2">
        <p className="font-semibold text-foreground text-sm">
          Views &amp; Engagement
        </p>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger
            size="sm"
            aria-label="Time period"
            className={cn(
              DATE_RANGE_SELECT_TRIGGER_CLASS,
              "rounded-full! py-1.5"
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-end gap-3">
          <p className="font-semibold font-space-grotesk text-4xl tracking-tight">
            {metrics.totalViews}
          </p>
          <p className="text-muted-foreground text-sm">
            {metrics.totalViewsLabel}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {metrics.breakdown.map((item) => (
            <div key={item.label} className="flex items-end gap-2">
              <span
                className={cn(
                  "mb-0.5 size-3 shrink-0 rounded-full",
                  item.color
                )}
                aria-hidden
              />
              <p className="text-muted-foreground text-xs">
                {item.value} {item.label}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
