import { createFileRoute } from "@tanstack/react-router"
import { SubscriptionsPage } from "@/features/subscriptions/components/subscriptions-page"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/subscriptions/")({
  component: WorkspaceSubscriptions,
})

function WorkspaceSubscriptions() {
  const { role } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="subscriptions">
      <SubscriptionsPage role={workspaceRole} />
    </WorkspaceSectionGate>
  )
}
