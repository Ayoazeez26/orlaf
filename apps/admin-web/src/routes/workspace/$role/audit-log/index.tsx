import { createFileRoute } from "@tanstack/react-router"
import { AuditLogPage } from "@/features/audit-log/components/audit-log-page"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/audit-log/")({
  component: WorkspaceAuditLog,
})

function WorkspaceAuditLog() {
  const { role } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="audit-log">
      <AuditLogPage role={workspaceRole} />
    </WorkspaceSectionGate>
  )
}
