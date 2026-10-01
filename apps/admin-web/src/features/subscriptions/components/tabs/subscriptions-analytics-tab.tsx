import { useAdminSubscriptionStats } from "../../api/subscriptions-hooks"
import { MrrTrendChart } from "../charts/mrr-trend-chart"
import { PlanMixCard } from "../charts/plan-mix-card"
import { SubscriptionsAnalyticsMetrics } from "../subscriptions-analytics-metrics"

export function SubscriptionsAnalyticsTab() {
  const { data } = useAdminSubscriptionStats()

  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <MrrTrendChart
          data={data.mrrTrend.data}
          changePercent={data.mrrTrend.changePercent}
        />
        <PlanMixCard items={data.planMix} />
      </div>
      <SubscriptionsAnalyticsMetrics metrics={data.metrics} />
    </div>
  )
}
