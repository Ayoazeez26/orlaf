import { Outlet, useParams } from "@tanstack/react-router"
import { useProject } from "../../hooks/use-project"
import { BackToProjectsLink } from "../shared/back-to-projects-link"
import { ProjectHeroCard } from "./project-hero-card"
import { ProjectTabNav } from "./project-tab-nav"

export function ProjectDetailLayout() {
  const { projectId } = useParams({ strict: false })
  const id = projectId ?? ""
  const { data: project, isLoading, isError } = useProject(id)

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <BackToProjectsLink />
        <p className="text-destructive text-sm">Project not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <BackToProjectsLink />
      <ProjectHeroCard project={project} />
      <ProjectTabNav projectId={project.id} />
      <Outlet />
    </div>
  )
}
