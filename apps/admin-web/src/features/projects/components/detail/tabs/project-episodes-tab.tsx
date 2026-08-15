import { Button } from "@workspace/ui/components/button"
import { Check, MoreHorizontal, Play, X } from "lucide-react"
import {
  usePublishEpisode,
  useRejectEpisode,
} from "../../../api/projects-hooks"
import { formatProjectViews } from "../../../data/project-details"
import type { ProjectDetail, ProjectEpisode } from "../../../types"
import {
  PublishStatusBadge,
  ReviewStatusBadge,
} from "../../project-badges"

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
              <EpisodeRow
                key={episode.id}
                projectId={project.id}
                seriesPublished={project.publishStatus === "published"}
                episode={episode}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EpisodeRow({
  projectId,
  seriesPublished,
  episode,
}: {
  projectId: string
  seriesPublished: boolean
  episode: ProjectEpisode
}) {
  const publish = usePublishEpisode(projectId, episode.id)
  const reject = useRejectEpisode(projectId, episode.id)
  const isBusy = publish.isPending || reject.isPending
  const showReviewActions =
    seriesPublished && episode.status === "pending_review"

  return (
    <tr className="border-border/60 border-b transition-colors last:border-0 hover:bg-muted/40">
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
        {episode.status === "pending_review" ? (
          <ReviewStatusBadge status="pending" />
        ) : episode.reviewStatus === "rejected" ? (
          <ReviewStatusBadge status="rejected" />
        ) : (
          <PublishStatusBadge status={episode.status} />
        )}
      </td>
      <td className="px-4 py-3 text-right">
        {showReviewActions ? (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isBusy}
              className="gap-1.5 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/5"
              onClick={() => publish.mutate()}
            >
              <Check className="size-3.5" aria-hidden />
              Approve
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isBusy}
              className="gap-1.5 border-red-500/30 text-red-600 hover:bg-red-500/5"
              onClick={() => reject.mutate()}
            >
              <X className="size-3.5" aria-hidden />
              Reject
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Episode actions"
          >
            <MoreHorizontal className="size-4" aria-hidden />
          </Button>
        )}
      </td>
    </tr>
  )
}
