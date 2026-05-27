import { Link } from "@tanstack/react-router"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { projectDetailPath } from "@/features/projects/constants"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { TopEpisodeRow } from "../types"
import { TrendBadge } from "./shared/trend-badge"

interface TopEpisodesListProps {
  episodes: TopEpisodeRow[]
  className?: string
}

export function TopEpisodesList({ episodes, className }: TopEpisodesListProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="pb-4">
        <p className="font-semibold text-foreground text-sm">Top Episodes</p>
      </CardHeader>
      <CardContent className="space-y-1 px-6">
        {episodes.map((episode) => (
          <Link
            key={`${episode.projectId}-${episode.episodeId}`}
            {...projectDetailPath(episode.projectId)}
            className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/50"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
              {episode.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground text-sm">
                {episode.episodeTitle}
              </p>
              <p className="truncate text-muted-foreground text-xs">
                {episode.seriesTitle}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="font-medium text-foreground text-sm">
                {episode.views}
              </span>
              <TrendBadge
                changePercent={episode.changePercent}
                variant="compact"
                className="px-1.5 py-0.5 text-[10px]"
              />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
