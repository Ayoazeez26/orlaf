import { useState } from "react"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { SubscriptionView } from "../types"
import { SubscriptionsPageHeader } from "./subscriptions-page-header"
import { SubscriptionsStatCards } from "./subscriptions-stat-cards"
import { SubscriptionsViewTabs } from "./subscriptions-view-tabs"
import { SubscriptionsAnalyticsTab } from "./tabs/subscriptions-analytics-tab"
import { SubscriptionsPlansTab } from "./tabs/subscriptions-plans-tab"
import { SubscriptionsPurchaseHistoryTab } from "./tabs/subscriptions-purchase-history-tab"
import { SubscriptionsSettingsTab } from "./tabs/subscriptions-settings-tab"

export function SubscriptionsPage({ role: _role }: { role: WorkspaceRoleId }) {
  const [activeView, setActiveView] = useState<SubscriptionView>("plans")

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <SubscriptionsPageHeader />
      <SubscriptionsStatCards />
      <SubscriptionsViewTabs active={activeView} onChange={setActiveView} />

      {activeView === "plans" ? <SubscriptionsPlansTab /> : null}
      {activeView === "analytics" ? <SubscriptionsAnalyticsTab /> : null}
      {activeView === "purchase-history" ? (
        <SubscriptionsPurchaseHistoryTab />
      ) : null}
      {activeView === "settings" ? <SubscriptionsSettingsTab /> : null}
    </div>
  )
}
