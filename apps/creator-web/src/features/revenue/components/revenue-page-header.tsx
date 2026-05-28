import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useState } from "react"
import {
  DEFAULT_REVENUE_DATE_RANGE,
  REVENUE_DATE_RANGE_OPTIONS,
} from "../constants"

export function RevenuePageHeader() {
  const [period, setPeriod] = useState(DEFAULT_REVENUE_DATE_RANGE)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-bold text-2xl text-foreground">Revenue</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Track performance across all your series
        </p>
      </div>
      <Select value={period} onValueChange={setPeriod}>
        <SelectTrigger
          size="sm"
          aria-label="Date range"
          className="w-full rounded-[10px] border-border bg-transparent px-4 py-4 sm:w-[160px] dark:bg-transparent"
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
    </div>
  )
}
