import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useState } from "react"
import {
  ANALYTICS_DATE_RANGE_OPTIONS,
  DATE_RANGE_SELECT_TRIGGER_HEADER_CLASS,
  DEFAULT_ANALYTICS_DATE_RANGE,
} from "../constants"
import type { AnalyticsDateRangeLabel } from "../types"

interface AnalyticsPageHeaderProps {
  period: AnalyticsDateRangeLabel
  onPeriodChange: (period: AnalyticsDateRangeLabel) => void
}

export function AnalyticsPageHeader({
  period,
  onPeriodChange,
}: AnalyticsPageHeaderProps) {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-bold text-2xl text-foreground">Analytics</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Track performance across all your series
        </p>
      </div>
      <Select
        value={period}
        onValueChange={(value) =>
          onPeriodChange(value as AnalyticsDateRangeLabel)
        }
      >
        <SelectTrigger
          size="sm"
          aria-label="Date range"
          className={DATE_RANGE_SELECT_TRIGGER_HEADER_CLASS}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ANALYTICS_DATE_RANGE_OPTIONS.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

/** Convenience wrapper if a page wants local period state */
export function useAnalyticsPeriodState(
  initial: AnalyticsDateRangeLabel = DEFAULT_ANALYTICS_DATE_RANGE
) {
  return useState<AnalyticsDateRangeLabel>(initial)
}
