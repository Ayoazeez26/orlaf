import {
  PAYOUT_ANALYTICS_METRICS,
  PAYOUT_TREND_DATA,
  TOP_EARNERS,
} from "../../data/payout-analytics"
import { PayoutsTopEarnersCard } from "../charts/payouts-top-earners-card"
import { PayoutsTrendChart } from "../charts/payouts-trend-chart"
import { PayoutsAnalyticsMetrics } from "../payouts-analytics-metrics"

export function PayoutsAnalyticsTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <PayoutsTrendChart data={PAYOUT_TREND_DATA} />
        <PayoutsTopEarnersCard earners={TOP_EARNERS} />
      </div>
      <PayoutsAnalyticsMetrics metrics={PAYOUT_ANALYTICS_METRICS} />
    </div>
  )
}
