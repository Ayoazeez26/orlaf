import { createFileRoute } from "@tanstack/react-router"
import { PayoutsPage } from "@/features/payouts/components/payouts-page"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/payouts/")({
  component: WorkspacePayouts,
})

function WorkspacePayouts() {
  const { role } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="payouts">
      <PayoutsPage role={workspaceRole} />
    </WorkspaceSectionGate>
  )
}
