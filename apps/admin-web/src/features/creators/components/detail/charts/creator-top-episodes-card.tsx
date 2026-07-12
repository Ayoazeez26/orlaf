import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { formatCreatorViews } from "../../../data/creator-details"
import type { TopEpisode } from "../../../types"

export function CreatorTopEpisodesCard({
  episodes,
}: {
  episodes: TopEpisode[]
}) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="space-y-5 px-6">
        <h2 className="font-semibold text-foreground text-lg tracking-tight">
          Top Episodes
        </h2>

        <ul className="space-y-4">
          {episodes.map((episode, index) => {
            const isPositive = episode.trend >= 0

            return (
              <li
                key={`${episode.title}-${episode.series}`}
                className="flex items-center gap-3"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm">
                    {episode.title}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {episode.series}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-medium text-foreground text-sm tabular-nums">
                    {formatCreatorViews(episode.views)}
                  </p>
                  <p
                    className={cn(
                      "inline-flex items-center gap-0.5 font-medium text-xs tabular-nums",
                      isPositive ? "text-emerald-600" : "text-red-600"
                    )}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="size-3" aria-hidden />
                    ) : (
                      <ArrowDownRight className="size-3" aria-hidden />
                    )}
                    {Math.abs(episode.trend)}%
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
