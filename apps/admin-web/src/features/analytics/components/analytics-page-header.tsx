import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  ANALYTICS_DATE_RANGE_OPTIONS,
  DATE_RANGE_SELECT_TRIGGER_HEADER_CLASS,
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
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Analytics
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Revenue, growth, retention and content performance at a glance.
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
