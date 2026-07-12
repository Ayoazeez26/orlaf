import { createFileRoute } from "@tanstack/react-router"
import { HomePage } from "@/features/workspaces/components/home/home-page"
import { getWorkspace } from "@/features/workspaces/data/roles"

export const Route = createFileRoute("/workspace/$role/")({
  component: WorkspaceHome,
})

function WorkspaceHome() {
  const { role } = Route.useParams()
  const config = getWorkspace(role)

  if (!config) return null

  return <HomePage config={config} />
}
