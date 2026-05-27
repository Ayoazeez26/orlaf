import { Link } from "@tanstack/react-router"
import { ProjectStatusBadge } from "@/features/projects/components/shared/project-status-badge"
import { ProjectThumbnail } from "@/features/projects/components/shared/project-thumbnail"
import { projectDetailPath } from "@/features/projects/constants"
import type { DashboardProject } from "../../types"

interface ProjectRowProps {
  project: DashboardProject
}

export function ProjectRow({ project }: ProjectRowProps) {
  return (
    <Link
      {...projectDetailPath(project.id)}
      className="flex items-center gap-4 border-border border-b py-4 last:border-b-0 transition-colors hover:bg-muted/30"
    >
      {project.thumbnailUrl ? (
        <ProjectThumbnail
          src={project.thumbnailUrl}
          alt={project.title}
          variant="row"
        />
      ) : (
        <div className="size-14 shrink-0 rounded-lg bg-muted" aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-foreground text-sm">
          {project.title}
        </p>
        <p className="text-muted-foreground text-xs">
          {project.episodeCount} episodes
        </p>
      </div>
      <ProjectStatusBadge status={project.status} />
    </Link>
  )
}
