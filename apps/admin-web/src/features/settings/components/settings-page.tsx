import { useState } from "react"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { SettingsTabId } from "../constants"
import { SettingsNav } from "./settings-nav"
import { SettingsPageHeader } from "./settings-page-header"
import { SettingsBrandingTab } from "./tabs/settings-branding-tab"
import { SettingsCoinEconomyTab } from "./tabs/settings-coin-economy-tab"
import { SettingsCreatorsTab } from "./tabs/settings-creators-tab"
import { SettingsDiscoveryTab } from "./tabs/settings-discovery-tab"
import { SettingsGeneralTab } from "./tabs/settings-general-tab"
import { SettingsModerationTab } from "./tabs/settings-moderation-tab"
import { SettingsNotificationsTab } from "./tabs/settings-notifications-tab"
import { SettingsPayoutsTab } from "./tabs/settings-payouts-tab"
import { SettingsSecurityTab } from "./tabs/settings-security-tab"
import { SettingsSubscriptionsTab } from "./tabs/settings-subscriptions-tab"
import { SettingsTeamTab } from "./tabs/settings-team-tab"

function renderSettingsTab(tab: SettingsTabId) {
  switch (tab) {
    case "general":
      return <SettingsGeneralTab />
    case "branding":
      return <SettingsBrandingTab />
    case "creators":
      return <SettingsCreatorsTab />
    case "moderation":
      return <SettingsModerationTab />
    case "discovery":
      return <SettingsDiscoveryTab />
    case "coin-economy":
      return <SettingsCoinEconomyTab />
    case "payouts":
      return <SettingsPayoutsTab />
    case "subscriptions":
      return <SettingsSubscriptionsTab />
    case "notifications":
      return <SettingsNotificationsTab />
    case "security":
      return <SettingsSecurityTab />
    case "team":
      return <SettingsTeamTab />
    default:
      return <SettingsGeneralTab />
  }
}

export function SettingsPage({ role: _role }: { role: WorkspaceRoleId }) {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("general")

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <SettingsPageHeader />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:items-start">
        <SettingsNav active={activeTab} onChange={setActiveTab} />
        <div className="min-w-0">{renderSettingsTab(activeTab)}</div>
      </div>
    </div>
  )
}
