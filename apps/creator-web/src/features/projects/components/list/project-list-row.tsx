import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { MoreHorizontal } from "lucide-react"
import { projectDetailPath } from "../../constants"
import { formatProjectMeta } from "../../lib/format-project-meta"
import type { ProjectSummary } from "../../types"
import { ProjectListThumbnail } from "../shared/project-list-thumbnail"
import { ProjectStatusBadge } from "../shared/project-status-badge"

interface ProjectListRowProps {
  project: ProjectSummary
}

export function ProjectListRow({ project }: ProjectListRowProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 sm:px-6">
      <Link
        {...projectDetailPath(project.id)}
        className="flex min-w-0 flex-1 items-center gap-4 transition-opacity hover:opacity-80"
      >
        <ProjectListThumbnail variant={project.iconVariant} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-foreground text-sm">
            {project.title}
          </p>
          <p className="truncate text-muted-foreground text-xs">
            {formatProjectMeta(project)}
          </p>
        </div>
      </Link>

      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden min-w-[88px] text-right font-medium text-foreground text-sm sm:inline">
          {project.views ?? "—"}
        </span>
        <ProjectStatusBadge status={project.status} variant="table" />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          aria-label={`Actions for ${project.title}`}
        >
          <MoreHorizontal className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  )
}
