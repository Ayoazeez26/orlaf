import { useQuery } from "@tanstack/react-query"
import { fetchAnalyticsDashboard } from "../api/analytics-api"
import { analyticsKeys } from "../data/query-keys"

export function useAnalyticsDashboard() {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: fetchAnalyticsDashboard,
  })
}
