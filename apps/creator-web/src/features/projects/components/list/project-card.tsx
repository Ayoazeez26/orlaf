import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { projectDetailPath } from "../../constants"
import type { ProjectSummary } from "../../types"
import { ProjectStatusBadge } from "../shared/project-status-badge"
import { ProjectThumbnail } from "../shared/project-thumbnail"

interface ProjectCardProps {
  project: ProjectSummary
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group flex w-full flex-col">
      <Link
        {...projectDetailPath(project.id)}
        className="block w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ProjectThumbnail
          src={project.thumbnailUrl}
          alt={project.title}
          variant="card"
        />
      </Link>
      <div className="mt-4 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              {...projectDetailPath(project.id)}
              className="truncate font-semibold text-foreground text-sm transition-colors group-hover:text-primary"
            >
              {project.title}
            </Link>
            <ProjectStatusBadge status={project.status} />
          </div>
          <p className="mt-1 text-muted-foreground text-xs">
            {project.updatedAt} • {project.episodeCount} Episodes
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="shrink-0">
              <MoreVertical className="size-4" aria-hidden />
              <span className="sr-only">Project actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit series</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  )
}
