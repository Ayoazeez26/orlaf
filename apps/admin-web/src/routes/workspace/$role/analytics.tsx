import { createFileRoute } from "@tanstack/react-router"
import { AnalyticsPage } from "@/features/analytics/components/analytics-page"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/analytics")({
  component: WorkspaceAnalytics,
})

function WorkspaceAnalytics() {
  const { role } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="analytics">
      <AnalyticsPage />
    </WorkspaceSectionGate>
  )
}
