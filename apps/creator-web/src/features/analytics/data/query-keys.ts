import type { AnalyticsRangeKey } from "@sable/contracts"

export const analyticsKeys = {
  all: ["analytics"] as const,
  dashboard: (range: AnalyticsRangeKey) =>
    [...analyticsKeys.all, "dashboard", range] as const,
}
