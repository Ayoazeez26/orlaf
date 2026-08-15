import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { useProjectQuery } from "@/features/projects/api/projects-hooks"
import { ProjectDetailPage } from "@/features/projects/components/detail/project-detail-page"
import { mapDetailToProject } from "@/features/projects/lib/map-project"
import { DetailPageSkeleton } from "@/features/workspaces/components/page-skeletons"
import { WorkspaceSectionGate } from "@/features/workspaces/components/workspace-section-gate"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/projects/$projectId")({
  component: WorkspaceProjectDetail,
})

function WorkspaceProjectDetail() {
  const { role, projectId } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId

  return (
    <WorkspaceSectionGate role={workspaceRole} sectionKey="projects">
      <ProjectDetailContent role={workspaceRole} projectId={projectId} />
    </WorkspaceSectionGate>
  )
}

function ProjectDetailContent({
  role,
  projectId,
}: {
  role: WorkspaceRoleId
  projectId: string
}) {
  const { data, isPending, isError } = useProjectQuery(projectId)

  if (isPending) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <DetailPageSkeleton />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <Link
          to="/workspace/$role/projects"
          params={{ role }}
          className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Projects
        </Link>
        <p className="text-muted-foreground text-sm">
          We couldn&apos;t find that project.
        </p>
      </div>
    )
  }

  const project = mapDetailToProject(data)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ProjectDetailPage project={project} role={role} />
    </div>
  )
}
