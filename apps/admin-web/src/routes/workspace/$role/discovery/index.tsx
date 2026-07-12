import { createFileRoute } from "@tanstack/react-router"
import { DiscoveryPage } from "@/features/discovery/components/discovery-page"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/discovery/")({
  component: WorkspaceDiscovery,
})

function WorkspaceDiscovery() {
  const { role } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="discovery">
      <DiscoveryPage role={workspaceRole} />
    </WorkspaceSectionGate>
  )
}
