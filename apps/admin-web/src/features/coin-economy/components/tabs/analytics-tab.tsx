import { useMemo } from "react"
import { useAdminEconomyStats } from "../../api/coin-economy-hooks"
import type {
  CoinAnalyticsMetric,
  CoinsSoldPoint,
  SpendCategory,
} from "../../types"
import { CoinsSoldChart } from "../charts/coins-sold-chart"
import { TopSpendCategoriesCard } from "../charts/top-spend-categories-card"
import { CoinEconomyAnalyticsMetrics } from "../coin-economy-analytics-metrics"

export function AnalyticsTab() {
  const { data: stats, isLoading } = useAdminEconomyStats()

  const coinsSoldData: CoinsSoldPoint[] = useMemo(() => {
    if (!stats?.coins_sold_by_month?.length) return []
    return stats.coins_sold_by_month.map((point) => ({
      month: point.month,
      amount: point.coins / 1_000_000,
    }))
  }, [stats?.coins_sold_by_month])

  const spendCategories: SpendCategory[] = useMemo(() => {
    return stats?.spend_categories ?? []
  }, [stats?.spend_categories])

  const metrics: CoinAnalyticsMetric[] = useMemo(() => {
    if (!stats) return []

    const avgCoinsPerBuyer =
      stats.purchases_30d > 0
        ? Math.round(stats.coins_sold_30d / stats.purchases_30d)
        : 0
    const refundRate =
      stats.purchases_30d > 0
        ? (stats.refunds_30d / stats.purchases_30d) * 100
        : 0
    const sinkRatio =
      stats.coins_sold_30d > 0
        ? (stats.coins_spent_30d / stats.coins_sold_30d) * 100
        : 0

    return [
      {
        label: "Avg coins / buyer",
        value: avgCoinsPerBuyer.toLocaleString("en-US"),
        changePercent: 0,
        increaseIsGood: true,
      },
      {
        label: "Purchases (30d)",
        value: stats.purchases_30d.toLocaleString("en-US"),
        changePercent: 0,
        increaseIsGood: true,
      },
      {
        label: "Refund rate",
        value: `${refundRate.toFixed(1)}%`,
        changePercent: 0,
        increaseIsGood: false,
      },
      {
        label: "Coin sink ratio",
        value: `${Math.round(sinkRatio)}%`,
        changePercent: 0,
        increaseIsGood: true,
      },
    ]
  }, [stats])

  if (isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center text-muted-foreground text-sm">
        Loading analytics…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <CoinsSoldChart data={coinsSoldData} />
        <TopSpendCategoriesCard categories={spendCategories} />
      </div>
      <CoinEconomyAnalyticsMetrics metrics={metrics} />
    </div>
  )
}
