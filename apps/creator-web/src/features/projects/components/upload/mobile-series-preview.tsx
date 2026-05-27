import { cn } from "@workspace/ui/lib/utils"
import { ChevronUp, Lock, Play } from "lucide-react"
import type { UploadEpisodeDraft } from "../../types"

interface MobileSeriesPreviewProps {
  title: string
  genre: string
  synopsis: string
  posterUrl: string
  episodes: UploadEpisodeDraft[]
  activeEpisodeId?: string
  className?: string
}

export function MobileSeriesPreview({
  title,
  genre,
  synopsis,
  posterUrl,
  episodes,
  activeEpisodeId,
  className,
}: MobileSeriesPreviewProps) {
  const displayTitle = title.trim() || "Your Series Title"
  const activeIndex = Math.max(
    0,
    episodes.findIndex((ep) => ep.id === activeEpisodeId)
  )
  const activeEpisode = episodes[activeIndex] ?? episodes[0]
  const progressPercent = 38

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[320px] overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_18px_40px_rgba(23,23,28,0.14)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      <div className="relative aspect-9/16 w-full">
        {posterUrl ? (
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
              <p className="line-clamp-2 max-w-[220px] text-white/70 text-sm leading-6">
                {synopsis.trim() ||
                  "Your series synopsis will appear here as you fill in the details...."}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-white/85">
                <span>1:02</span>
                <span>{activeEpisode?.duration ?? "4:32"}</span>
              </div>
              <div className="relative h-1 rounded-full bg-white/25">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  style={{ width: `${progressPercent}%` }}
                />
                <span
                  className="absolute top-1/2 block size-3 -translate-y-1/2 rounded-full border-2 border-primary bg-background shadow-sm"
                  style={{ left: `calc(${progressPercent}% - 6px)` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary shadow-[0_8px_20px_rgba(124,58,237,0.35)]">
                <Play className="ml-0.5 size-5 fill-current text-white" aria-hidden />
              </span>

              <div className="flex items-center gap-2 text-white/90">
                <Play className="size-3.5 text-primary" aria-hidden />
                <span className="font-medium text-sm">
                  EP.{activeIndex + 1} / EP.{episodes.length}
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
            <p className="text-text-subtle text-sm">Season 1</p>
          </div>
          <ul className="space-y-3">
            {episodes.slice(0, 4).map((ep, index) => (
              <li
                key={ep.id}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-[18px] px-4 py-2.5",
                  index === activeIndex
                    ? "bg-upload-step-complete"
                    : "bg-transparent"
                )}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Play
                    className="size-3 text-text-subtle"
                    aria-hidden
                  />
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-[15px] text-text-strong">
                      {ep.title}
                    </span>
                    <span className="block text-sm text-text-subtle">
                      {ep.duration}
                    </span>
                  </span>
                </span>
                {index !== activeIndex && (
                  <Lock
                    className="size-4 shrink-0 text-muted-foreground/70"
                    aria-hidden
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
