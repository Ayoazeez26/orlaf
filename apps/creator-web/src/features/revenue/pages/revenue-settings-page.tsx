import { PayoutScheduleSection } from "../components/settings/payout-schedule-section"
import { RevenueNotificationsSection } from "../components/settings/revenue-notifications-section"
import { useRevenueDashboard } from "../hooks/use-revenue-dashboard"

export function RevenueSettingsPage() {
  const { data } = useRevenueDashboard()

  if (!data) return null

  return (
    <div className="max-w-3xl space-y-6">
      <PayoutScheduleSection schedule={data.payoutSchedule} />
      <RevenueNotificationsSection settings={data.notifications} />
    </div>
  )
}
