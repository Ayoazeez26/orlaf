import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { cn } from "@workspace/ui/lib/utils"
import { Pencil, Sparkles } from "lucide-react"
import { projectKeys } from "../../data/query-keys"
import { useMediaUploadPipeline } from "../../hooks/use-media-upload-pipeline"
import { useSaveUploadDraft } from "../../hooks/use-save-upload-draft"
import { formatUploadGenres } from "../../lib/format-upload-genres"
import type { UploadEpisodeDraft } from "../../types"
import { useUploadWizard } from "../../upload/upload-wizard-context"
import { UploadSeriesPreviewAside } from "./upload-series-preview-aside"
import { UploadReviewStepNav } from "./upload-step-nav"

interface UploadReviewStepProps {
  onBack: () => void
}

export function UploadReviewStep({ onBack }: UploadReviewStepProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { state, dispatch, previewImage } = useUploadWizard()
  const saveDraft = useSaveUploadDraft()
  const { publish, isPublishing, publishError, progress } =
    useMediaUploadPipeline()

  const displayTitle = state.title.trim() || "The Returnees"
  const freeCount = state.episodes.filter((e) => e.access === "free").length
  const premiumCount = state.episodes.filter(
    (e) => e.access === "premium"
  ).length
  const episodesWithMedia = state.episodes.filter(
    (e) => e.media?.status === "ready"
  ).length
  const canPublish =
    state.seriesId != null &&
    (state.episodes.length === 0 ||
      state.episodes.every((e) => e.media?.status === "ready"))

  async function handlePublish() {
    try {
      await publish(state)
      queryClient.invalidateQueries({ queryKey: projectKeys.list() })
      dispatch({ type: "RESET" })
      navigate({ to: "/dashboard/projects" })
    } catch {
      // publishError is set in the hook
    }
  }

  return (
    <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="min-w-0 space-y-6">
        <Card className="py-6 shadow-none">
          <CardContent className="space-y-5">
            <div className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-gradient text-primary-foreground">
                <Sparkles className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-foreground">
                  Ready to Publish?
                </p>
                <p className="text-muted-foreground text-sm">
                  Review everything before going live.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <SummaryChip label="Language" value={state.language} />
              <SummaryChip
                label="Episodes"
                value={String(state.episodes.length)}
              />
              <SummaryChip
                label="With video"
                value={String(episodesWithMedia)}
              />
              <SummaryChip label="Free" value={String(freeCount)} />
              <SummaryChip label="Premium" value={String(premiumCount)} />
              {state.trailer?.file && (
                <SummaryChip label="Trailer" value="Added" />
              )}
            </div>
            {isPublishing && progress && (
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">
                  {progress.label}
                </p>
                <Progress value={progress.value * 100} />
              </div>
            )}
            {publishError && (
              <p className="text-destructive text-sm">{publishError}</p>
            )}
            {!canPublish && !isPublishing && state.episodes.length > 0 && (
              <p className="text-muted-foreground text-sm">
                All episodes must finish uploading before you can publish.
              </p>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="outline"
                onClick={saveDraft}
                disabled={isPublishing}
              >
                Save as Draft
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isPublishing || !canPublish}
              >
                <Sparkles className="size-4" aria-hidden />
                {isPublishing ? "Publishing…" : "Publish Series"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="py-6 shadow-none">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-foreground text-sm">
                Episodes ({state.episodes.length})
              </p>
              <Button
                variant="link"
                className="h-auto gap-2 p-0 text-primary"
                onClick={onBack}
                disabled={isPublishing}
              >
                <Pencil className="size-4" aria-hidden />
                Edit Episodes
              </Button>
            </div>
            <ul className="space-y-2">
              {state.episodes.map((episode, index) => (
                <EpisodeReviewRow
                  key={episode.id}
                  episode={episode}
                  index={index}
                />
              ))}
            </ul>
          </CardContent>
        </Card>

        <UploadReviewStepNav onBack={onBack} className="hidden xl:flex" />
      </div>

      <div className="flex flex-col gap-6">
        <UploadSeriesPreviewAside
          title={displayTitle}
          genre={formatUploadGenres(state.genres)}
          synopsis={state.synopsis}
          posterUrl={previewImage}
          trailerUrl={state.trailerUrl}
          episodes={state.episodes}
        />
        <UploadReviewStepNav onBack={onBack} className="xl:hidden" />
      </div>
    </div>
  )
}

function SummaryChip({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "min-w-[7.5rem] flex-1 rounded-lg border bg-muted/30 px-3 py-3 text-center sm:w-[172px] sm:max-w-[172px] sm:flex-none",
        className
      )}
    >
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-1 font-semibold text-foreground text-sm">{value}</p>
    </div>
  )
}

function EpisodeReviewRow({
  episode,
  index,
}: {
  episode: UploadEpisodeDraft
  index: number
}) {
  return (
    <li className="rounded-lg bg-muted/40 px-4 py-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs">
          {index + 1}
        </span>
        <span className="min-w-0 flex-1 truncate font-medium text-foreground text-sm">
          {episode.title}
        </span>
        <span className="shrink-0 text-muted-foreground text-xs">
          {episode.duration}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 pl-9">
        {episode.media?.file ? (
          <BadgePill variant="solid">Video ready</BadgePill>
        ) : (
          <BadgePill>No video</BadgePill>
        )}
        <BadgePill>9:16 Vertical</BadgePill>
        <BadgePill variant={episode.access === "free" ? "solid" : "outline"}>
          {episode.access === "free"
            ? "Free"
            : episode.access === "premium"
              ? "Premium"
              : "Coins"}
        </BadgePill>
        <BadgePill>CC</BadgePill>
      </div>
    </li>
  )
}

function BadgePill({
  children,
  variant = "outline",
}: {
  children: React.ReactNode
  variant?: "solid" | "outline"
}) {
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5 font-medium text-[10px] uppercase",
        variant === "solid"
          ? "bg-primary text-primary-foreground"
          : "border border-primary/30 text-primary"
      )}
    >
      {children}
    </span>
  )
}
