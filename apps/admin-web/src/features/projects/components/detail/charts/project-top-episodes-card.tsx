import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { formatProjectViews } from "../../../data/project-details"
import type { TopPerformingEpisode } from "../../../types"

export function ProjectTopEpisodesCard({
  episodes,
}: {
  episodes: TopPerformingEpisode[]
}) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="space-y-5 px-6">
        <h2 className="font-semibold text-foreground text-lg tracking-tight">
          Top Episodes
        </h2>

        <ul className="space-y-4">
          {episodes.map((episode) => (
            <li
              key={episode.title}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
                  {episode.rank}
                </span>
                <p className="truncate font-medium text-foreground text-sm">
                  {episode.title}
                </p>
              </div>
              <p className="shrink-0 font-medium text-foreground text-sm tabular-nums">
                {formatProjectViews(episode.views)} views
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
