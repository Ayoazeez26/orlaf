import { Button } from "@workspace/ui/components/button"
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCw,
  X,
} from "lucide-react"
import { useCallback, useState } from "react"
import {
  useEpisodePlaybackQuery,
  usePublishEpisode,
  useRejectEpisode,
} from "../../api/projects-hooks"
import type { ProjectDetail, ProjectEpisode } from "../../types"
import { PublishStatusBadge, ReviewStatusBadge } from "../project-badges"
import { HlsVideoPlayer } from "./hls-video-player"
import { useModalShell } from "./use-modal-shell"

interface EpisodePreviewDialogProps {
  project: ProjectDetail
  /** Episode to show; null closes the dialog. */
  episodeId: string | null
  onEpisodeChange: (episodeId: string | null) => void
}

export function EpisodePreviewDialog({
  project,
  episodeId,
  onEpisodeChange,
}: EpisodePreviewDialogProps) {
  const open = episodeId !== null
  const close = useCallback(() => onEpisodeChange(null), [onEpisodeChange])
  useModalShell(open, close)

  if (!open) return null

  const playable = project.episodes.filter((episode) => episode.playable)
  const index = playable.findIndex((episode) => episode.id === episodeId)
  const episode = playable[index]
  if (!episode) return null

  const prev = playable[index - 1]
  const next = playable[index + 1]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close preview"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="episode-preview-title"
        className="relative z-10 flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-border border-b px-5 py-4">
          <div className="min-w-0">
            <h2
              id="episode-preview-title"
              className="truncate font-semibold text-foreground"
            >
              Ep {episode.number}: {episode.title}
            </h2>
            <p className="truncate text-muted-foreground text-xs">
              {project.title} · {episode.duration}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={close}
            aria-label="Close"
          >
            <X className="size-4" aria-hidden />
          </Button>
        </div>

        {/* key remounts the player so it never shows the previous episode */}
        <EpisodePlayer
          key={episode.id}
          seriesId={project.id}
          episodeId={episode.id}
        />

        <div className="flex items-center justify-between gap-3 border-border border-t px-5 py-3">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={!prev}
              onClick={() => prev && onEpisodeChange(prev.id)}
              aria-label="Previous episode"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </Button>
            <span className="text-muted-foreground text-xs tabular-nums">
              {index + 1} / {playable.length}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={!next}
              onClick={() => next && onEpisodeChange(next.id)}
              aria-label="Next episode"
            >
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          </div>

          <EpisodeReviewActions
            key={episode.id}
            seriesId={project.id}
            seriesPublished={project.publishStatus === "published"}
            episode={episode}
            onDone={() => onEpisodeChange(next ? next.id : null)}
          />
        </div>
      </div>
    </div>
  )
}

function EpisodePlayer({
  seriesId,
  episodeId,
}: {
  seriesId: string
  episodeId: string
}) {
  const playback = useEpisodePlaybackQuery(seriesId, episodeId)
  const [failed, setFailed] = useState(false)

  const retry = () => {
    setFailed(false)
    void playback.refetch()
  }

  return (
    <div className="relative aspect-[9/16] max-h-[70vh] w-full bg-black">
      {playback.isPending ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2
            className="size-8 animate-spin text-white/70"
            aria-label="Loading video"
          />
        </div>
      ) : playback.isError || failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <AlertCircle className="size-8 text-white/70" aria-hidden />
          <p className="text-sm text-white/80">
            {playback.error instanceof Error
              ? playback.error.message
              : "This video couldn't be played."}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={retry}
          >
            <RotateCw className="size-3.5" aria-hidden />
            Try again
          </Button>
        </div>
      ) : (
        <HlsVideoPlayer
          src={playback.data.url}
          className="absolute inset-0"
          onFatalError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

function EpisodeReviewActions({
  seriesId,
  seriesPublished,
  episode,
  onDone,
}: {
  seriesId: string
  seriesPublished: boolean
  episode: ProjectEpisode
  onDone: () => void
}) {
  const publish = usePublishEpisode(seriesId, episode.id)
  const reject = useRejectEpisode(seriesId, episode.id)
  const isBusy = publish.isPending || reject.isPending

  // Episodes of an unpublished series are approved with the series itself.
  if (!seriesPublished || episode.status !== "pending_review") {
    return episode.reviewStatus === "rejected" ? (
      <ReviewStatusBadge status="rejected" />
    ) : episode.status === "pending_review" ? (
      <ReviewStatusBadge status="pending" />
    ) : (
      <PublishStatusBadge status={episode.status} />
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isBusy}
        className="gap-1.5 border-red-500/30 text-red-600 hover:bg-red-500/5"
        onClick={() => reject.mutate(undefined, { onSuccess: onDone })}
      >
        <X className="size-3.5" aria-hidden />
        Reject
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isBusy}
        className="gap-1.5 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/5"
        onClick={() => publish.mutate(undefined, { onSuccess: onDone })}
      >
        <Check className="size-3.5" aria-hidden />
        Approve
      </Button>
    </div>
  )
}
