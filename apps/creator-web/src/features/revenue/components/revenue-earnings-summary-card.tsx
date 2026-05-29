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
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { DATE_RANGE_SELECT_TRIGGER_CLASS } from "@/features/analytics/constants"
import {
  DEFAULT_REVENUE_DATE_RANGE,
  REVENUE_DATE_RANGE_OPTIONS,
  REVENUE_SOURCE_COLORS,
} from "../constants"
import type { RevenueEarningsBreakdownItem } from "../types"

interface RevenueEarningsSummaryCardProps {
  total: string
  breakdown: RevenueEarningsBreakdownItem[]
  className?: string
}

export function RevenueEarningsSummaryCard({
  total,
  breakdown,
  className,
}: RevenueEarningsSummaryCardProps) {
  const [period, setPeriod] = useState(DEFAULT_REVENUE_DATE_RANGE)

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="flex flex-row flex-wrap items-center justify-start gap-3 space-y-0 pb-4 sm:gap-4">
        <p className="font-semibold text-foreground text-lg">Earnings</p>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger
            size="sm"
            aria-label="Earnings date range"
            className={cn(DATE_RANGE_SELECT_TRIGGER_CLASS, "py-4")}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REVENUE_DATE_RANGE_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="font-bold font-space-grotesk text-4xl text-foreground tracking-tight">
          {total}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {breakdown.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: REVENUE_SOURCE_COLORS[item.colorKey] }}
                aria-hidden
              />
              <span className="text-muted-foreground text-sm">
                {item.amount} {item.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
