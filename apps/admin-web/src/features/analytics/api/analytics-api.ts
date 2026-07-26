import type { AdminAnalyticsOverview, AnalyticsRangeKey } from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export function fetchAdminAnalyticsOverview(
  range: AnalyticsRangeKey
): Promise<AdminAnalyticsOverview> {
  return apiRequest<AdminAnalyticsOverview>(
    `/api/v1/admin/analytics/overview?range=${range}`
  )
}
