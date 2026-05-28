import { EarnMoreSection } from "@/features/dashboard/components/home/earn-more-section"
import { EarningsOverTimeChart } from "../components/overview/earnings-over-time-chart"
import { RevenueBreakdownCard } from "../components/overview/revenue-breakdown-card"
import { useRevenueDashboard } from "../hooks/use-revenue-dashboard"

export function RevenueOverviewPage() {
  const { data } = useRevenueDashboard()

  if (!data) return null

  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-3">
        <EarningsOverTimeChart
          data={data.earningsOverTime}
          className="lg:col-span-2"
        />
        <RevenueBreakdownCard items={data.revenueBreakdown} />
      </div>
      <EarnMoreSection cards={data.earnMoreCards} />
    </div>
  )
}
