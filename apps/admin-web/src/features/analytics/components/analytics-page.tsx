import { useMemo, useState } from "react"
import { useAdminAnalyticsOverview } from "../api/analytics-hooks"
import { DEFAULT_ANALYTICS_DATE_RANGE } from "../constants"
import { MOCK_SUPER_ADMIN_ANALYTICS } from "../data/mock-super-admin-analytics"
import {
  mapAdminAnalyticsOverview,
  RANGE_LABEL_TO_KEY,
} from "../lib/map-admin-analytics"
import type { AnalyticsDateRangeLabel } from "../types"
import { AnalyticsKpiCard } from "./analytics-kpi-card"
import { AnalyticsPageHeader } from "./analytics-page-header"
import { ConversionFunnelCard } from "./charts/conversion-funnel-card"
import { RetentionChart } from "./charts/retention-chart"
import { RevenueAnalyticsChart } from "./charts/revenue-analytics-chart"
import { UserGrowthChart } from "./charts/user-growth-chart"

export function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsDateRangeLabel>(
    DEFAULT_ANALYTICS_DATE_RANGE
  )
  const range = RANGE_LABEL_TO_KEY[period]
  const { data, isLoading, isError, isFetching } =
    useAdminAnalyticsOverview(range)

  const analytics = useMemo(() => {
    if (!data) return MOCK_SUPER_ADMIN_ANALYTICS
    return mapAdminAnalyticsOverview(data)
  }, [data])

  const { kpis, revenue, userGrowth, retention, retentionBadge, funnel } =
    analytics

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <AnalyticsPageHeader period={period} onPeriodChange={setPeriod} />

      {isError ? (
        <p className="text-destructive text-sm">
          Could not load growth analytics. Showing placeholder numbers for
          unavailable metrics.
        </p>
      ) : null}

      {isLoading && !data ? (
        <p className="text-muted-foreground text-sm">Loading analytics…</p>
      ) : (
        <>
          <div
            className={
              isFetching && data
                ? "grid gap-4 opacity-80 transition-opacity sm:grid-cols-2 xl:grid-cols-4"
                : "grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            }
          >
            {kpis.map((kpi) => (
              <AnalyticsKpiCard key={kpi.label} kpi={kpi} />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <RevenueAnalyticsChart data={revenue} />
            <UserGrowthChart data={userGrowth} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <RetentionChart data={retention} badge={retentionBadge} />
            <ConversionFunnelCard
              subtitle={funnel.subtitle}
              stages={funnel.stages}
            />
          </div>
        </>
      )}
    </div>
  )
}
