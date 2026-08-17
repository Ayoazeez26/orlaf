import { Outlet, useParams } from "@tanstack/react-router"
import { ProjectDetailSkeleton } from "@/features/dashboard/components/home/dashboard-home-skeleton"
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
      <div className="p-4 sm:p-6 lg:p-8">
        <ProjectDetailSkeleton />
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <BackToProjectsLink />
        <p className="text-muted-foreground text-sm">
          Unable to load this project.
        </p>
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
