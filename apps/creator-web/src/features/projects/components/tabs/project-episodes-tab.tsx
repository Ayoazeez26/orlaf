import { Link, useParams } from "@tanstack/react-router"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { MoreVertical, Play, Plus } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "../../constants/frosted-card"
import { useProject } from "../../hooks/use-project"

export function ProjectEpisodesTab() {
  const { projectId } = useParams({ strict: false })
  const { data: project } = useProject(projectId ?? "")

  if (!project) return null

  return (
    <div className={cn(FROSTED_CARD_SURFACE_CLASS, "overflow-hidden")}>
      <div className="flex items-center justify-between gap-4 p-6">
        <div>
          <h2 className="font-semibold text-base text-text-strong">
            All Episodes
          </h2>
          <p className="mt-1 text-muted-foreground text-sm">
            {project.episodes.length} episodes
          </p>
        </div>
        <Button asChild className="shrink-0 gap-2">
          <Link
            to="/dashboard/projects/new"
            search={{
              seriesId: project.id,
              step: "episodes",
              addEpisode: true,
            }}
          >
            <Plus className="size-4" aria-hidden />
            Add Episode
          </Link>
        </Button>
      </div>
      <div>
        {project.episodes.map((episode) => (
          <div
            key={episode.id}
            className="flex items-center gap-4 border-border border-t px-6 py-4"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EDEBFF] text-primary">
              <Play className="size-4" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-sm text-text-strong">
                  Ep. {episode.number} — {episode.title}
                </p>
                <Badge
                  variant="outline"
                  className="border-[#2BBB7133] bg-[#2BBB7126] text-[#002C0F] text-xs"
                >
                  Published
                </Badge>
              </div>
              <p className="mt-1 text-muted-foreground text-sm">
                {episode.duration} · {episode.views} views
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Episode actions"
              className="shrink-0"
            >
              <MoreVertical className="size-4" aria-hidden />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
