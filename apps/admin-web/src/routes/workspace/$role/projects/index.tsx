import { createFileRoute } from "@tanstack/react-router"
import { ProjectsPage } from "@/features/projects/components/projects-page"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/projects/")({
  component: WorkspaceProjects,
})

function WorkspaceProjects() {
  const { role } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="projects">
      <ProjectsPage role={workspaceRole} />
    </WorkspaceSectionGate>
  )
}
