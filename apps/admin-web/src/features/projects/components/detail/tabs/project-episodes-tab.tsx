import { Button } from "@workspace/ui/components/button"
import { MoreHorizontal, Play } from "lucide-react"
import { formatProjectViews } from "../../../data/project-details"
import type { ProjectDetail } from "../../../types"
import { PublishStatusBadge } from "../../project-badges"

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

export function ProjectEpisodesTab({ project }: { project: ProjectDetail }) {
  return (
    <div className="overflow-hidden rounded-[16px] border bg-surface-frosted backdrop-blur-[24px]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-border border-b">
              <th className={HEAD_CLASS}>Episode</th>
              <th className={HEAD_CLASS}>Duration</th>
              <th className={HEAD_CLASS}>Size</th>
              <th className={HEAD_CLASS}>Views</th>
              <th className={HEAD_CLASS}>Status</th>
              <th className={HEAD_CLASS}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {project.episodes.map((episode) => (
              <tr
                key={episode.id}
                className="border-border/60 border-b transition-colors last:border-0 hover:bg-muted/40"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="shrink-0 text-primary hover:bg-primary/10"
                      aria-label={`Play ${episode.title}`}
                    >
                      <Play className="size-4 fill-current" aria-hidden />
                    </Button>
                    <span className="font-medium text-foreground">
                      Ep {episode.number}: {episode.title}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground tabular-nums">
                  {episode.duration}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {episode.size}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground tabular-nums">
                  {formatProjectViews(episode.views)}
                </td>
                <td className="px-4 py-3">
                  <PublishStatusBadge status={episode.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Episode actions"
                  >
                    <MoreHorizontal className="size-4" aria-hidden />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
