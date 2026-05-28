import { BankAccountsCard } from "../components/payouts/bank-accounts-card"
import { RecentPayoutsCard } from "../components/payouts/recent-payouts-card"
import { useRevenueDashboard } from "../hooks/use-revenue-dashboard"

export function RevenuePayoutsPage() {
  const { data } = useRevenueDashboard()

  if (!data) return null

  return (
    <div className="space-y-6">
      <RecentPayoutsCard payouts={data.recentPayouts} />
      <BankAccountsCard accounts={data.bankAccounts} />
    </div>
  )
}
