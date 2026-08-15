import type { AnalyticsRangeKey } from "@sable/contracts"
import { useQuery } from "@tanstack/react-query"
import {
  fetchAdminAnalyticsOverview,
  fetchAdminAnalyticsSummary,
} from "./analytics-api"

export const adminAnalyticsKeys = {
  all: ["admin", "analytics"] as const,
  overview: (range: AnalyticsRangeKey) =>
    [...adminAnalyticsKeys.all, "overview", range] as const,
}

export function useAdminAnalyticsOverview(range: AnalyticsRangeKey) {
  return useQuery({
    queryKey: adminAnalyticsKeys.overview(range),
    queryFn: () => fetchAdminAnalyticsOverview(range),
  })
}

export function useAdminAnalyticsSummary() {
  return useQuery({
    queryKey: [...adminAnalyticsKeys.all, "summary"] as const,
    queryFn: fetchAdminAnalyticsSummary,
  })
}
