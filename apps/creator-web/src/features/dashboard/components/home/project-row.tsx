import { Link } from "@tanstack/react-router"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { MoreHorizontal } from "lucide-react"
import { ProjectListThumbnail } from "@/features/projects/components/shared/project-list-thumbnail"
import { projectDetailPath } from "@/features/projects/constants"
import type { DashboardProject, DashboardProjectStatus } from "../../types"

const STATUS_STYLES: Record<
  DashboardProjectStatus,
  { label: string; className: string }
> = {
  published: {
    label: "Published",
    className: "border-[#2BBB7133] bg-[#2BBB7126] text-[#002C0F]",
  },
  in_review: {
    label: "In review",
    className: "border-transparent bg-[#FFF0C5] text-[#5C2C00]",
  },
  draft: {
    label: "Draft",
    className: "border-transparent bg-[#F0F2F7] text-[#5F636F]",
  },
}

function formatProjectMeta(project: DashboardProject) {
  const parts = [project.type, project.genre]

  if (project.episodeCount !== undefined) {
    parts.push(`${project.episodeCount} eps`)
  } else if (project.duration) {
    parts.push(project.duration)
  }

  parts.push(`Updated ${project.updatedAt}`)
  return parts.join(" · ")
}

interface ProjectRowProps {
  project: DashboardProject
}

export function ProjectRow({ project }: ProjectRowProps) {
  const status = STATUS_STYLES[project.status]

  return (
    <div className="flex items-center gap-4 border-border border-b py-4 last:border-b-0">
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
        {project.views ? (
          <span className="hidden font-medium text-foreground text-sm sm:inline">
            {project.views}
          </span>
        ) : null}
        <Badge
          variant="outline"
          className={cn(
            "shrink-0 px-2.5 py-1.5 font-medium text-xs",
            status.className
          )}
        >
          {status.label}
        </Badge>
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
