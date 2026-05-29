import { Outlet } from "@tanstack/react-router"
import { RevenueEarningsSummaryCard } from "../components/revenue-earnings-summary-card"
import { RevenuePageHeader } from "../components/revenue-page-header"
import { RevenuePageSkeleton } from "../components/revenue-page-skeleton"
import { RevenueTabNav } from "../components/revenue-tab-nav"
import { useRevenueDashboard } from "../hooks/use-revenue-dashboard"

export function RevenueLayout() {
  const { data, isLoading, isError } = useRevenueDashboard()

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <RevenuePageHeader />

      {isLoading && <RevenuePageSkeleton />}

      {isError && (
        <p className="text-destructive text-sm">
          Could not load revenue data. Please try again.
        </p>
      )}

      {data && (
        <>
          <RevenueEarningsSummaryCard
            total={data.earningsSummary.total}
            breakdown={data.earningsSummary.breakdown}
          />
          <RevenueTabNav />
          <Outlet />
        </>
      )}
    </div>
  )
}
