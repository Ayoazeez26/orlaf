import {
  MRR_TREND_DATA,
  PLAN_MIX,
  SUBSCRIPTION_ANALYTICS_METRICS,
} from "../../data/subscription-analytics"
import { MrrTrendChart } from "../charts/mrr-trend-chart"
import { PlanMixCard } from "../charts/plan-mix-card"
import { SubscriptionsAnalyticsMetrics } from "../subscriptions-analytics-metrics"

export function SubscriptionsAnalyticsTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <MrrTrendChart data={MRR_TREND_DATA} />
        <PlanMixCard items={PLAN_MIX} />
      </div>
      <SubscriptionsAnalyticsMetrics metrics={SUBSCRIPTION_ANALYTICS_METRICS} />
    </div>
  )
}
