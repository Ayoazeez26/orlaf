import { createFileRoute } from "@tanstack/react-router"
import { RevenueSplitPage } from "@/features/revenue-split/components/revenue-split-page"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/revenue-split/")({
  component: WorkspaceRevenueSplit,
})

function WorkspaceRevenueSplit() {
  const { role } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="revenue-split">
      <RevenueSplitPage role={workspaceRole} />
    </WorkspaceSectionGate>
  )
}
