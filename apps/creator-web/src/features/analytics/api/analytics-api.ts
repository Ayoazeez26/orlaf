import type {
  AnalyticsRangeKey,
  CreatorAnalyticsOverview,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"
import { mapAnalyticsOverview } from "../lib/map-analytics-overview"
import type { AnalyticsDashboardData } from "../types"

export async function fetchAnalyticsDashboard(
  range: AnalyticsRangeKey = "30d",
  seriesId?: string
): Promise<AnalyticsDashboardData> {
  const params = new URLSearchParams({ range })
  if (seriesId) params.set("seriesId", seriesId)
  const overview = await apiRequest<CreatorAnalyticsOverview>(
    `/api/v1/studio/analytics/overview?${params.toString()}`
  )
  return mapAnalyticsOverview(overview)
}
