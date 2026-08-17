import { createFileRoute } from "@tanstack/react-router"
import { SupportPage } from "@/features/support/components/support-page"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/support/")({
  validateSearch: (search: Record<string, unknown>) => ({
    ticket: typeof search.ticket === "string" ? search.ticket : undefined,
  }),
  component: WorkspaceSupport,
})

function WorkspaceSupport() {
  const { role } = Route.useParams()
  const { ticket } = Route.useSearch()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="support">
      <SupportPage role={workspaceRole} ticketId={ticket} />
    </WorkspaceSectionGate>
  )
}
