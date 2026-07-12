import { createFileRoute } from "@tanstack/react-router"
import { PromotionsPage } from "@/features/promotions/components/promotions-page"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/promotions/")({
  component: WorkspacePromotions,
})

function WorkspacePromotions() {
  const { role } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="promotions">
      <PromotionsPage role={workspaceRole} />
    </WorkspaceSectionGate>
  )
}
