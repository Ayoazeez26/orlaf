import { PayoutProcessSteps } from "../components/wallet/payout-process-steps"
import { RecentActivityCard } from "../components/wallet/recent-activity-card"
import { WalletBalanceCard } from "../components/wallet/wallet-balance-card"
import { useRevenueDashboard } from "../hooks/use-revenue-dashboard"

export function RevenueOverviewPage() {
  const { data } = useRevenueDashboard()

  if (!data) return null

  return (
    <div className="space-y-6">
      <WalletBalanceCard wallet={data.wallet} />
      <PayoutProcessSteps />
      <RecentActivityCard activities={data.walletActivity} />
    </div>
  )
}
