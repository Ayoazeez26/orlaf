import { useState } from "react"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { PayoutView } from "../types"
import { PayoutsPageHeader } from "./payouts-page-header"
import { PayoutsStatCards } from "./payouts-stat-cards"
import { PayoutsViewTabs } from "./payouts-view-tabs"
import { PayoutsAnalyticsTab } from "./tabs/payouts-analytics-tab"
import { PayoutsRecentTab } from "./tabs/payouts-recent-tab"
import { PayoutsSettingsTab } from "./tabs/payouts-settings-tab"

export function PayoutsPage({ role: _role }: { role: WorkspaceRoleId }) {
  const [activeView, setActiveView] = useState<PayoutView>("recent")

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <PayoutsPageHeader />
      <PayoutsStatCards />
      <PayoutsViewTabs active={activeView} onChange={setActiveView} />

      {activeView === "recent" ? <PayoutsRecentTab /> : null}
      {activeView === "analytics" ? <PayoutsAnalyticsTab /> : null}
      {activeView === "settings" ? <PayoutsSettingsTab /> : null}
    </div>
  )
}
