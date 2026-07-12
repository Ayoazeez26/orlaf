import { MOCK_SUPER_ADMIN_ANALYTICS } from "../data/mock-super-admin-analytics"
import { AnalyticsKpiCard } from "./analytics-kpi-card"
import { AnalyticsPageHeader } from "./analytics-page-header"
import { ConversionFunnelCard } from "./charts/conversion-funnel-card"
import { RetentionChart } from "./charts/retention-chart"
import { RevenueAnalyticsChart } from "./charts/revenue-analytics-chart"
import { UserGrowthChart } from "./charts/user-growth-chart"

export function AnalyticsPage() {
  const { kpis, revenue, userGrowth, retention, retentionBadge, funnel } =
    MOCK_SUPER_ADMIN_ANALYTICS

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <AnalyticsPageHeader />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
    </div>
  )
}
