import type { AnalyticsRangeKey, CreatorAnalyticsOverview } from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"
import { mapAnalyticsOverview } from "../lib/map-analytics-overview"
import type { AnalyticsDashboardData } from "../types"

export async function fetchAnalyticsDashboard(
  range: AnalyticsRangeKey = "30d"
): Promise<AnalyticsDashboardData> {
  const overview = await apiRequest<CreatorAnalyticsOverview>(
    `/api/v1/studio/analytics/overview?range=${range}`
  )
  return mapAnalyticsOverview(overview)
}
