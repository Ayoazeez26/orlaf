import { createFileRoute } from "@tanstack/react-router"
import { StreamersPage } from "@/features/streamers/components/streamers-page"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/streamers/")({
  component: WorkspaceStreamers,
})

function WorkspaceStreamers() {
  const { role } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="streamers">
      <StreamersPage role={workspaceRole} />
    </WorkspaceSectionGate>
  )
}
