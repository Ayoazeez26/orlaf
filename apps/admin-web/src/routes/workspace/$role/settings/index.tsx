import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { SettingsPage } from "@/features/settings/components/settings-page"
import {
  SETTINGS_TABS,
  type SettingsTabId,
} from "@/features/settings/constants"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/settings/")({
  validateSearch: (
    search: Record<string, unknown>
  ): { tab?: SettingsTabId } => ({
    tab: SETTINGS_TABS.some((t) => t.id === search.tab)
      ? (search.tab as SettingsTabId)
      : undefined,
  }),
  component: WorkspaceSettings,
})

function WorkspaceSettings() {
  const { role } = Route.useParams()
  const { tab = "general" } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="settings">
      <SettingsPage
        role={workspaceRole}
        activeTab={tab}
        onTabChange={(next) =>
          navigate({
            search: { tab: next === "general" ? undefined : next },
            replace: true,
          })
        }
      />
    </WorkspaceSectionGate>
  )
}
