import { createFileRoute, redirect } from "@tanstack/react-router"
import { DashboardLayout } from "@/features/workspaces/components/layout/dashboard-layout"
import { getWorkspace, isWorkspaceRole } from "@/features/workspaces/data/roles"

export const Route = createFileRoute("/workspace/$role")({
  beforeLoad: ({ params }) => {
    if (!isWorkspaceRole(params.role)) {
      throw redirect({ to: "/" })
    }
  },
  component: WorkspaceLayout,
})

function WorkspaceLayout() {
  const { role } = Route.useParams()
  const config = getWorkspace(role)

  if (!config) return null

  return <DashboardLayout config={config} />
}
