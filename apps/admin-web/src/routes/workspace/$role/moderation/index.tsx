import { createFileRoute } from "@tanstack/react-router"
import { ModerationPage } from "@/features/moderation/components/moderation-page"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/moderation/")({
  component: WorkspaceModeration,
})

function WorkspaceModeration() {
  const { role } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="moderation">
      <ModerationPage role={workspaceRole} />
    </WorkspaceSectionGate>
  )
}
