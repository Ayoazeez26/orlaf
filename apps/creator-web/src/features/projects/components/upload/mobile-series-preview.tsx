import { cn } from "@workspace/ui/lib/utils"
import { ChevronUp, Lock, Play } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import type { UploadEpisodeDraft } from "../../types"
import {
  MediaPreviewPlayPauseButton,
  MediaPreviewVideoLayer,
  MediaPreviewVolumeControl,
  useMediaPreviewPlayer,
} from "./media-preview-player"

interface MobileSeriesPreviewProps {
  title: string
  genre: string
  synopsis: string
  posterUrl: string
  trailerUrl?: string | null
  episodes: UploadEpisodeDraft[]
  activeEpisodeId?: string
  className?: string
}

type PreviewSource =
  | { kind: "trailer" }
  | { kind: "episode"; episodeId: string }

function isLockedAccess(access: UploadEpisodeDraft["access"]) {
  return access === "coins" || access === "premium"
}

function hasPlayableMedia(episode: UploadEpisodeDraft) {
  const media = episode.media
  if (media?.status !== "ready") return false
  return Boolean(media.hlsUrl || (media.file && media.file.size > 0))
}

function useEpisodeObjectUrl(file?: File | null) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file || file.size === 0) {
      setUrl(null)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  return url
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const total = Math.floor(seconds)
  const minutes = Math.floor(total / 60)
  const secs = total % 60
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}

export function MobileSeriesPreview({
  title,
  genre,
  synopsis,
  posterUrl,
  trailerUrl,
  episodes,
  activeEpisodeId,
  className,
}: MobileSeriesPreviewProps) {
  const displayTitle = title.trim() || "Your Series Title"
  const [source, setSource] = useState<PreviewSource>({ kind: "trailer" })

  useEffect(() => {
    if (!activeEpisodeId) return
    const matched = episodes.find((ep) => ep.id === activeEpisodeId)
    if (matched && hasPlayableMedia(matched)) {
      setSource({ kind: "episode", episodeId: matched.id })
    }
  }, [activeEpisodeId, episodes])

  const activeEpisode =
    source.kind === "episode"
      ? (episodes.find((ep) => ep.id === source.episodeId) ?? null)
      : null
  const activeIndex = activeEpisode ? episodes.indexOf(activeEpisode) : -1

  const episodeObjectUrl = useEpisodeObjectUrl(
    activeEpisode && !activeEpisode.media?.hlsUrl
      ? activeEpisode.media?.file
      : null
  )

  const playbackSrc = useMemo(() => {
    if (source.kind === "trailer") return trailerUrl ?? ""
    return activeEpisode?.media?.hlsUrl ?? episodeObjectUrl ?? ""
  }, [source, trailerUrl, activeEpisode, episodeObjectUrl])

  const player = useMediaPreviewPlayer({ src: playbackSrc })

  function handleSelectEpisode(episode: UploadEpisodeDraft) {
    if (!hasPlayableMedia(episode)) return
    setSource({ kind: "episode", episodeId: episode.id })
  }

  function handleVolumeChange(value: number) {
    player.setVolume(value)
  }

  const progressPercent = Math.round(player.progress * 100)
  const remainingLabel = activeEpisode?.duration || "0:00"

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[320px] overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_18px_40px_rgba(23,23,28,0.14)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      <div className="relative aspect-9/16 w-full">
        {playbackSrc ? (
          <MediaPreviewVideoLayer
            videoRef={player.videoRef}
            posterUrl={posterUrl}
          />
        ) : posterUrl ? (
          <img
            src={posterUrl}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#7c3aed_0%,#111827_100%)]" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/88 via-black/28 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-4 text-white">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <p className="font-semibold text-[15px] leading-tight">
                {displayTitle}
              </p>
              <div className="flex items-center gap-2 text-white/80 text-xs">
                <span>OrlAf Creators</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 font-medium text-white">
                  {genre || "Drama"}
                </span>
              </div>
              <p className="line-clamp-2 max-w-[220px] text-sm text-white/70 leading-6">
                {synopsis.trim() ||
                  "Your series synopsis will appear here as you fill in the details...."}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-white/85">
                <span>{formatTime(player.progress * player.duration)}</span>
                <span>
                  {source.kind === "episode"
                    ? remainingLabel
                    : formatTime(player.duration)}
                </span>
              </div>
              <button
                type="button"
                className="relative block h-1 w-full rounded-full bg-white/25"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const percent = (e.clientX - rect.left) / rect.width
                  player.seekToPercent(percent)
                }}
                aria-label="Seek"
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  style={{ width: `${progressPercent}%` }}
                />
                <span
                  className="absolute top-1/2 block size-3 -translate-y-1/2 rounded-full border-2 border-primary bg-background shadow-sm"
                  style={{ left: `calc(${progressPercent}% - 6px)` }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                {playbackSrc ? (
                  <MediaPreviewPlayPauseButton
                    playing={player.playing}
                    onToggle={player.togglePlayback}
                  />
                ) : (
                  <span className="flex size-11 items-center justify-center rounded-full bg-primary shadow-[0_8px_20px_rgba(124,58,237,0.35)]">
                    <Play
                      className="ml-0.5 size-5 fill-current text-white"
                      aria-hidden
                    />
                  </span>
                )}
                {playbackSrc && (
                  <MediaPreviewVolumeControl
                    muted={player.muted}
                    volume={player.volume}
                    onToggleMute={player.toggleMute}
                    onVolumeChange={handleVolumeChange}
                  />
                )}
              </div>

              <div className="flex items-center gap-2 text-white/90">
                <Play className="size-3.5 text-primary" aria-hidden />
                <span className="font-medium text-sm">
                  {source.kind === "episode"
                    ? `EP.${activeIndex + 1} / EP.${episodes.length}`
                    : "Trailer"}
                </span>
                <ChevronUp className="size-4" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4 bg-card p-4">
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary text-xs dark:bg-primary/15">
          {genre || "Drama"}
        </span>
        <div>
          <p className="font-semibold text-primary text-sm">Synopsis</p>
          <p className="mt-1 line-clamp-2 text-sm text-text-subtle leading-6">
            {synopsis.trim() ||
              "Your series synopsis will appear here as you...."}
          </p>
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold text-sm text-text-strong">Episodes</p>
            <p className="text-sm text-text-subtle">Season 1</p>
          </div>
          <ul className="space-y-3">
            {episodes.slice(0, 4).map((ep, index) => {
              const playable = hasPlayableMedia(ep)
              const isActive =
                source.kind === "episode" && index === activeIndex

              return (
                <li key={ep.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectEpisode(ep)}
                    disabled={!playable}
                    className={cn(
                      "flex w-full items-center justify-between gap-4 rounded-[18px] px-4 py-2.5 text-left transition-colors",
                      isActive ? "bg-upload-step-complete" : "bg-transparent",
                      playable
                        ? "cursor-pointer hover:bg-muted"
                        : "cursor-default opacity-70"
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Play className="size-3 text-text-subtle" aria-hidden />
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-[15px] text-text-strong">
                          {ep.title}
                        </span>
                        <span className="block text-sm text-text-subtle">
                          {ep.duration}
                        </span>
                      </span>
                    </span>
                    {isLockedAccess(ep.access) && (
                      <Lock
                        className="size-4 shrink-0 text-muted-foreground/70"
                        aria-hidden
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
