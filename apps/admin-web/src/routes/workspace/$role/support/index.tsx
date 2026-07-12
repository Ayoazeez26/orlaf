import { createFileRoute } from "@tanstack/react-router"
import { SupportPage } from "@/features/support/components/support-page"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/support/")({
  component: WorkspaceSupport,
})

function WorkspaceSupport() {
  const { role } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="support">
      <SupportPage role={workspaceRole} />
    </WorkspaceSectionGate>
  )
}
