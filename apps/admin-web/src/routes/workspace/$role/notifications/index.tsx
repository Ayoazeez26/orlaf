import { createFileRoute } from "@tanstack/react-router"
import { NotificationsPage } from "@/features/notifications/components/notifications-page"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/notifications/")({
  component: WorkspaceNotifications,
})

function WorkspaceNotifications() {
  const { role } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="notifications">
      <NotificationsPage role={workspaceRole} />
    </WorkspaceSectionGate>
  )
}
