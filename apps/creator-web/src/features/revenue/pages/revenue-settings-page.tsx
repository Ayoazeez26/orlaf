import { BankAccountsCard } from "../components/payouts/bank-accounts-card"
import { PayoutScheduleSection } from "../components/settings/payout-schedule-section"
import { useRevenueDashboard } from "../hooks/use-revenue-dashboard"

export function RevenueSettingsPage() {
  const { data } = useRevenueDashboard()

  if (!data) return null

  return (
    <div className="max-w-3xl space-y-6">
      <PayoutScheduleSection schedule={data.payoutSchedule} />
      <BankAccountsCard
        accounts={data.bankAccounts}
        title="Payment Methods"
        addButtonLabel="Add Method"
      />
    </div>
  )
}
