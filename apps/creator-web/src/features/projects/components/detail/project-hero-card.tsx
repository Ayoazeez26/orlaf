import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Pencil, Plus } from "lucide-react"
import { FROSTED_CARD_CLASS } from "../../constants/frosted-card"
import type { ProjectDetail } from "../../types"
import { ProjectStatusBadge } from "../shared/project-status-badge"
import { ProjectThumbnail } from "../shared/project-thumbnail"

interface ProjectHeroCardProps {
  project: ProjectDetail
}

export function ProjectHeroCard({ project }: ProjectHeroCardProps) {
  return (
    <div className={cn(FROSTED_CARD_CLASS, "flex flex-col gap-6 md:flex-row")}>
      <ProjectThumbnail
        src={project.thumbnailUrl}
        alt={project.title}
        variant="hero"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-semibold text-2xl text-foreground">
              {project.title}
            </h1>
            <ProjectStatusBadge status={project.status} />
          </div>
          <p className="mt-2 text-muted-foreground text-sm">
            {project.genre} • {project.episodeCount} episodes •{" "}
            {project.totalViews} views
          </p>
          <p className="mt-1 line-clamp-2 text-muted-foreground text-sm leading-relaxed lg:w-3/4">
            {project.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
          <Button asChild variant="outline" className="h-10 rounded-xl px-6">
            <Link
              to="/dashboard/projects/new"
              search={{ seriesId: project.id, step: "info" }}
            >
              <Pencil className="size-4" aria-hidden />
              Edit Series
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
