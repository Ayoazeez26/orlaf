import { createFileRoute } from "@tanstack/react-router"
import { CreatorsPage } from "@/features/creators/components/creators-page"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/creators/")({
  component: WorkspaceCreators,
})

function WorkspaceCreators() {
  const { role } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="creators">
      <CreatorsPage role={workspaceRole} />
    </WorkspaceSectionGate>
  )
}
