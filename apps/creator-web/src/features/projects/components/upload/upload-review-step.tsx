import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Pencil, Sparkles } from "lucide-react"
import { projectKeys } from "../../data/query-keys"
import type { EpisodeAccess, UploadEpisodeDraft } from "../../types"
import { useUploadWizard } from "../../upload/upload-wizard-context"
import { MobileSeriesPreview } from "./mobile-series-preview"

interface UploadReviewStepProps {
  onBack: () => void
}

export function UploadReviewStep({ onBack }: UploadReviewStepProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { state, dispatch, previewImage } = useUploadWizard()

  const displayTitle = state.title.trim() || "The Returnees"
  const freeCount = state.episodes.filter((e) => e.access === "free").length
  const premiumCount = state.episodes.filter(
    (e) => e.access === "premium"
  ).length
  function handlePublish() {
    queryClient.invalidateQueries({ queryKey: projectKeys.list() })
    dispatch({ type: "RESET" })
    navigate({ to: "/dashboard/projects" })
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
      <div className="space-y-6">
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
              <SummaryChip label="Free" value={String(freeCount)} />
              <SummaryChip label="Premium" value={String(premiumCount)} />
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="outline">Save as Draft</Button>
              <Button onClick={handlePublish}>
                <Sparkles className="size-4" aria-hidden />
                Publish Series
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

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            ← Back to Episodes
          </Button>
        </div>
      </div>

      <div className="hidden xl:block">
        <div className="sticky top-8">
          <MobileSeriesPreview
            title={displayTitle}
            genre={state.genre}
            synopsis={state.synopsis}
            posterUrl={previewImage}
            episodes={state.episodes}
          />
        </div>
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
        "w-[172px] max-w-[172px] rounded-lg border bg-muted/30 px-3 py-3 text-center",
        className
      )}
    >
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-semibold text-foreground text-sm mt-1">{value}</p>
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
    <li className="flex flex-wrap items-center gap-2 rounded-lg bg-muted/40 px-4 py-3">
      <span className="flex size-7 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs">
        {index + 1}
      </span>
      <span className="min-w-0 flex-1 font-medium text-foreground text-sm">
        {episode.title}
      </span>
      <span className="text-muted-foreground text-xs">{episode.duration}</span>
      <BadgePill>9:16 Vertical</BadgePill>
      <BadgePill variant={episode.access === "free" ? "solid" : "outline"}>
        {episode.access === "free"
          ? "Free"
          : episode.access === "premium"
            ? "Premium"
            : "Coins"}
      </BadgePill>
      <BadgePill>CC</BadgePill>
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
