import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Pencil, Plus } from "lucide-react"
import { FROSTED_CARD_CLASS } from "../../constants/frosted-card"
import type { ProjectDetail } from "../../types"
import { ProjectListThumbnail } from "../shared/project-list-thumbnail"
import { ProjectStatusBadge } from "../shared/project-status-badge"

interface ProjectHeroCardProps {
  project: ProjectDetail
}

export function ProjectHeroCard({ project }: ProjectHeroCardProps) {
  return (
    <div className={cn(FROSTED_CARD_CLASS, "flex items-center gap-4")}>
      <ProjectListThumbnail
        variant={project.iconVariant}
        className="h-24 w-16 rounded-2xl"
        iconClassName="size-6"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-bold text-2xl text-foreground">
            {project.title}
          </h1>
          <ProjectStatusBadge status={project.status} />
        </div>
        <p className="mt-1 text-muted-foreground text-sm">
          {project.type} · {project.genre} · {project.episodeCount} episodes
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Button asChild variant="outline" className="h-10 rounded-xl px-6">
          <Link
            to="/dashboard/projects/new"
            search={{ seriesId: project.id, step: "info" }}
          >
            <Pencil className="size-4" aria-hidden />
            Edit
          </Link>
        </Button>
        <Button asChild>
          <Link
            to="/dashboard/projects/new"
            search={{
              seriesId: project.id,
              step: "episodes",
              addEpisode: true,
            }}
          >
            <Plus className="size-4" aria-hidden />
            New Episode
          </Link>
        </Button>
      </div>
    </div>
  )
}
