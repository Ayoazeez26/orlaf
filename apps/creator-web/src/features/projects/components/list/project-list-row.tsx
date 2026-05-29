import { Link } from "@tanstack/react-router"
import { projectDetailPath } from "../../constants"
import type { ProjectSummary } from "../../types"
import { ProjectStatusBadge } from "../shared/project-status-badge"
import { ProjectThumbnail } from "../shared/project-thumbnail"

interface ProjectListRowProps {
  project: ProjectSummary
}

export function ProjectListRow({ project }: ProjectListRowProps) {
  return (
    <Link
      {...projectDetailPath(project.id)}
      className="flex flex-wrap items-center gap-3 px-4 py-4 transition-colors hover:bg-muted/30 sm:flex-nowrap sm:gap-4 sm:px-5"
    >
      <ProjectThumbnail
        src={project.thumbnailUrl}
        alt={project.title}
        variant="row"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-[15px] text-text-strong">
          {project.title}
        </p>
        <p className="text-sm text-text-subtle">
          {project.episodeCount} episodes
        </p>
      </div>
      <ProjectStatusBadge status={project.status} variant="list" />
    </Link>
  )
}
