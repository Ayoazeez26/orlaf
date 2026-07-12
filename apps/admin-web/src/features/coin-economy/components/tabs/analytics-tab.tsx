import {
  COIN_ANALYTICS_METRICS,
  COINS_SOLD_DATA,
  TOP_SPEND_CATEGORIES,
} from "../../data/coin-analytics"
import { CoinsSoldChart } from "../charts/coins-sold-chart"
import { TopSpendCategoriesCard } from "../charts/top-spend-categories-card"
import { CoinEconomyAnalyticsMetrics } from "../coin-economy-analytics-metrics"

export function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <CoinsSoldChart data={COINS_SOLD_DATA} />
        <TopSpendCategoriesCard categories={TOP_SPEND_CATEGORIES} />
      </div>
      <CoinEconomyAnalyticsMetrics metrics={COIN_ANALYTICS_METRICS} />
    </div>
  )
}
