import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import type { DashboardProject, ProjectStatus } from "../../types"

const STATUS_STYLES: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  ongoing: {
    label: "ONGOING",
    className:
      "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  },
  completed: {
    label: "COMPLETED",
    className: "border-transparent bg-primary/15 text-primary",
  },
  draft: {
    label: "DRAFT",
    className: "border-transparent bg-muted text-muted-foreground",
  },
}

interface ProjectRowProps {
  project: DashboardProject
}

export function ProjectRow({ project }: ProjectRowProps) {
  const status = STATUS_STYLES[project.status]

  return (
    <div className="flex items-center gap-4 border-border border-b py-4 last:border-b-0">
      <div className="size-14 shrink-0 rounded-lg bg-muted" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-foreground text-sm">
          {project.title}
        </p>
        <p className="text-muted-foreground text-xs">
          {project.episodeCount} episodes
        </p>
      </div>
      <Badge
        variant="outline"
        className={cn(
          "shrink-0 font-semibold text-[10px] uppercase",
          status.className
        )}
      >
        {status.label}
      </Badge>
    </div>
  )
}
