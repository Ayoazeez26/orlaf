import { createFileRoute } from "@tanstack/react-router"
import { SettingsPage } from "@/features/settings/components/settings-page"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/settings/")({
  component: WorkspaceSettings,
})

function WorkspaceSettings() {
  const { role } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="settings">
      <SettingsPage role={workspaceRole} />
    </WorkspaceSectionGate>
  )
}
