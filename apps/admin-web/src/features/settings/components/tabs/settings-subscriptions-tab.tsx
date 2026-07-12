import { SubscriptionsPlansTab } from "@/features/subscriptions/components/tabs/subscriptions-plans-tab"
import { SubscriptionsSettingsTab } from "@/features/subscriptions/components/tabs/subscriptions-settings-tab"

export function SettingsSubscriptionsTab() {
  return (
    <div className="space-y-6">
      <SubscriptionsSettingsTab />
      <SubscriptionsPlansTab />
    </div>
  )
}
