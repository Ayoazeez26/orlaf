import { useState } from "react"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { CreatorDetail } from "../../types"
import { CreatorDetailHeader } from "./creator-detail-header"
import { type CreatorDetailTab, CreatorDetailTabs } from "./creator-detail-tabs"
import { CreatorAnalyticsTab } from "./tabs/creator-analytics-tab"
import { CreatorOverviewTab } from "./tabs/creator-overview-tab"
import { CreatorPayoutsTab } from "./tabs/creator-payouts-tab"
import { CreatorProjectsTab } from "./tabs/creator-projects-tab"

interface CreatorDetailPageProps {
  creator: CreatorDetail
  role: WorkspaceRoleId
}

export function CreatorDetailPage({ creator, role }: CreatorDetailPageProps) {
  const [activeTab, setActiveTab] = useState<CreatorDetailTab>("overview")

  return (
    <div className="space-y-6">
      <CreatorDetailHeader creator={creator} role={role} />

      <CreatorDetailTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" ? (
        <CreatorOverviewTab creator={creator} />
      ) : null}
      {activeTab === "projects" ? (
        <CreatorProjectsTab creator={creator} />
      ) : null}
      {activeTab === "analytics" ? (
        <CreatorAnalyticsTab analytics={creator.analytics} />
      ) : null}
      {activeTab === "payouts" ? (
        <CreatorPayoutsTab payouts={creator.payouts} />
      ) : null}
    </div>
  )
}
