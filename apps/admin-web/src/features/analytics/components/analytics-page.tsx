import { useState } from "react"
import { AnalyticsPageSkeleton } from "@/features/workspaces/components/page-skeletons"
import { useAdminAnalyticsOverview } from "../api/analytics-hooks"
import { DEFAULT_ANALYTICS_DATE_RANGE } from "../constants"
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
  const { data, isPending, isError, isFetching } =
    useAdminAnalyticsOverview(range)

  const analytics = data ? mapAdminAnalyticsOverview(data) : null

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <AnalyticsPageHeader period={period} onPeriodChange={setPeriod} />

      {isPending ? <AnalyticsPageSkeleton /> : null}

      {isError || (!isPending && !analytics) ? (
        <p className="text-destructive text-sm">
          Could not load growth analytics. Please try again.
        </p>
      ) : null}

      {analytics ? (
        <>
          <div
            className={
              isFetching
                ? "grid gap-4 opacity-80 transition-opacity sm:grid-cols-2 xl:grid-cols-4"
                : "grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            }
          >
            {analytics.kpis.map((kpi) => (
              <AnalyticsKpiCard key={kpi.label} kpi={kpi} />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <RevenueAnalyticsChart data={analytics.revenue} />
            <UserGrowthChart data={analytics.userGrowth} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <RetentionChart
              data={analytics.retention}
              badge={analytics.retentionBadge}
            />
            <ConversionFunnelCard
              subtitle={analytics.funnel.subtitle}
              stages={analytics.funnel.stages}
            />
          </div>
        </>
      ) : null}
    </div>
  )
}
