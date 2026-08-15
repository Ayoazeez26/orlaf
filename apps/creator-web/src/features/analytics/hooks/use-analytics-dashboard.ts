import { useQuery } from "@tanstack/react-query"
import { fetchAnalyticsDashboard } from "../api/analytics-api"
import { analyticsKeys } from "../data/query-keys"
import { RANGE_LABEL_TO_KEY } from "../lib/map-analytics-overview"
import type { AnalyticsDateRangeLabel } from "../types"

export function useAnalyticsDashboard(
  period: AnalyticsDateRangeLabel,
  seriesId?: string
) {
  const range = RANGE_LABEL_TO_KEY[period]

  return useQuery({
    queryKey: analyticsKeys.dashboard(range, seriesId),
    queryFn: () => fetchAnalyticsDashboard(range, seriesId),
    enabled: seriesId !== "",
  })
}
