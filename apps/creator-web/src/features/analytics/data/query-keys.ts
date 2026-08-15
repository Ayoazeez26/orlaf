import type { AnalyticsRangeKey } from "@sable/contracts"

export const analyticsKeys = {
  all: ["analytics"] as const,
  dashboard: (range: AnalyticsRangeKey, seriesId?: string) =>
    [...analyticsKeys.all, "dashboard", range, seriesId ?? "all"] as const,
}
