import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Progress } from "@workspace/ui/components/progress"
import { cn } from "@workspace/ui/lib/utils"
import {
  Calendar,
  Check,
  Circle,
  Clapperboard,
  FileText,
  Rocket,
  Save,
  Users,
  X,
} from "lucide-react"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "../../constants/frosted-card"
import { projectKeys } from "../../data/query-keys"
import { useMediaUploadPipeline } from "../../hooks/use-media-upload-pipeline"
import { useSaveUploadDraft } from "../../hooks/use-save-upload-draft"
import { formatUploadGenres } from "../../lib/format-upload-genres"
import type { UploadEpisodeDraft, UploadWizardState } from "../../types"
import { useUploadWizard } from "../../upload/upload-wizard-context"
import { UploadReviewStepNav } from "./upload-step-nav"

interface UploadReviewStepProps {
  onBack: () => void
}

type ScheduleMode = "immediate" | "later"

export function UploadReviewStep({ onBack }: UploadReviewStepProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { state, dispatch } = useUploadWizard()
  const saveDraft = useSaveUploadDraft()
  const { publish, isPublishing, publishError, progress } =
    useMediaUploadPipeline()
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>("immediate")
  const [goLiveAt, setGoLiveAt] = useState("")

  const displayTitle = state.title.trim() || "Untitled"
  const seriesTitle = state.title.trim() || "—"
  const projectTypeLabel =
    state.projectType === "short-film" ? "Short film" : "Short series"
  const accessLabel = state.access === "coins" ? "Coin-gated" : "Free"
  const genresLabel = formatUploadGenres(state.genres) || "—"
  const subtitlesLabel =
    state.subtitleTracks.length > 0 ? state.subtitleTracks.join(", ") : "—"
  const castNames = namedPeople(state.cast)
  const crewNames = namedPeople(state.crew)
  const posterReady = Boolean(
    state.poster?.status === "ready" || state.poster?.remoteUrl
  )
  const trailerReady = Boolean(
    state.trailer?.status === "ready" || state.trailerUrl
  )
  const posterTrailerLabel = [
    posterReady ? "Poster ready" : "No poster",
    trailerReady ? "Trailer ready" : "No trailer",
  ].join(" · ")

  const checklist = [
    { id: "title", label: "Title", done: state.title.trim().length > 0 },
    {
      id: "genre",
      label: "At least one genre",
      done: state.genres.length > 0,
    },
    { id: "poster", label: "Film poster", done: posterReady },
    {
      id: "episode",
      label: "At least one episode video",
      done: state.episodes.some((episode) => episode.media?.status === "ready"),
    },
  ] as const

  const checklistComplete = checklist.every((item) => item.done)
  const canSubmit =
    state.seriesId != null &&
    checklistComplete &&
    (state.episodes.length === 0 ||
      state.episodes.every((episode) => episode.media?.status === "ready"))

  async function handleSubmit() {
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
    <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
      <div className="w-full min-w-0 max-w-[740px] space-y-6">
        <ReviewSectionCard icon={FileText} title="Series Info">
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <DetailRow label="Title" value={seriesTitle} />
            <DetailRow label="Type" value={projectTypeLabel} />
            <DetailRow label="Primary language" value={state.language || "—"} />
            <DetailRow label="Subtitles" value={subtitlesLabel} />
            <DetailRow label="Genres" value={genresLabel} />
            <DetailRow label="Access" value={accessLabel} />
            <DetailRow
              label="AI vertical conversion"
              value={state.aiConversionEnabled ? "Enabled" : "Disabled"}
            />
            <DetailRow label="Poster / Trailer" value={posterTrailerLabel} />
          </dl>
        </ReviewSectionCard>

        <ReviewSectionCard icon={Users} title="Cast & Crew">
          <div className="grid gap-6 sm:grid-cols-2">
            <PeopleColumn label="Cast" names={castNames} />
            <PeopleColumn label="Crew" names={crewNames} />
          </div>
        </ReviewSectionCard>

        <ReviewSectionCard
          icon={Clapperboard}
          title={`Episodes (${state.episodes.length})`}
        >
          <ul className="space-y-2">
            {state.episodes.map((episode, index) => (
              <EpisodeReviewRow
                key={episode.id}
                episode={episode}
                index={index}
              />
            ))}
          </ul>
        </ReviewSectionCard>

        <ReviewSectionCard
          icon={Calendar}
          title="Schedule"
          subtitle="Publish immediately after review, or pick a go-live date."
        >
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <ScheduleOption
                selected={scheduleMode === "immediate"}
                title="Publish immediately"
                description="Goes live as soon as it clears review."
                onSelect={() => setScheduleMode("immediate")}
              />
              <ScheduleOption
                selected={scheduleMode === "later"}
                title="Schedule for later"
                description="Pick a date and time to go live."
                onSelect={() => setScheduleMode("later")}
              />
            </div>

            {scheduleMode === "later" ? (
              <div className="space-y-2">
                <Label htmlFor="go-live-datetime">Go-live date & time</Label>
                <div className="relative">
                  <Input
                    id="go-live-datetime"
                    type="text"
                    value={goLiveAt}
                    onChange={(e) => setGoLiveAt(e.target.value)}
                    placeholder="mm/dd/yyyy, --:-- --"
                    className="h-[52px] rounded-2xl bg-input-bg pr-11 text-base dark:bg-input-bg"
                  />
                  <Calendar
                    className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-foreground"
                    aria-hidden
                  />
                </div>
              </div>
            ) : null}
          </div>
        </ReviewSectionCard>

        <UploadReviewStepNav onBack={onBack} className="hidden xl:flex" />
      </div>

      <div className="flex flex-col gap-6">
        <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
          <CardContent className="space-y-5">
            <div className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Rocket className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-foreground">
                  Ready to publish?
                </p>
                <p className="text-muted-foreground text-sm">
                  Everything looks good? Submit for a quality review before
                  going live.
                </p>
              </div>
            </div>

            <ul className="space-y-2.5">
              {checklist.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2 text-foreground text-sm"
                >
                  {item.done ? (
                    <Check
                      className="size-4 shrink-0 text-primary"
                      aria-hidden
                    />
                  ) : (
                    <X
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                  )}
                  <span className={cn(!item.done && "text-muted-foreground")}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>

            {isPublishing && progress ? (
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">
                  {progress.label}
                </p>
                <Progress value={progress.value * 100} />
              </div>
            ) : null}

            {publishError ? (
              <p className="text-destructive text-sm">{publishError}</p>
            ) : null}

            <div className="flex flex-col gap-2">
              <Button
                className="w-full"
                onClick={() => void handleSubmit()}
                disabled={isPublishing || !canSubmit}
              >
                <Rocket className="size-4" aria-hidden />
                {isPublishing ? "Submitting…" : "Submit for review"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={saveDraft}
                disabled={isPublishing}
              >
                <Save className="size-4" aria-hidden />
                Save as draft
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
          <CardContent className="space-y-4">
            <p className="font-semibold text-foreground">Summary</p>
            <dl className="space-y-3">
              <SummaryRow label="Project" value={displayTitle} />
              <SummaryRow label="Type" value={projectTypeLabel} />
              <SummaryRow
                label="Episodes"
                value={String(state.episodes.length)}
              />
              <SummaryRow label="Access" value={accessLabel} />
              <SummaryRow
                label="Go-live"
                value={
                  scheduleMode === "immediate" ? "After review" : "Scheduled"
                }
              />
            </dl>
          </CardContent>
        </Card>

        <UploadReviewStepNav onBack={onBack} className="xl:hidden" />
      </div>
    </div>
  )
}

function namedPeople(people: UploadWizardState["cast"]) {
  return people.map((person) => person.name.trim()).filter(Boolean)
}

function ReviewSectionCard({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="space-y-5">
        <div className="flex gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-5" aria-hidden />
          </span>
          <div>
            <p className="font-semibold text-foreground">{title}</p>
            {subtitle ? (
              <p className="text-muted-foreground text-sm">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="mt-1 truncate font-medium text-foreground text-sm">
        {value}
      </dd>
    </div>
  )
}

function PeopleColumn({ label, names }: { label: string; names: string[] }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      {names.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {names.map((name) => (
            <li key={name} className="font-medium text-foreground text-sm">
              {name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-muted-foreground text-sm">None added.</p>
      )}
    </div>
  )
}

function ScheduleOption({
  selected,
  title,
  description,
  onSelect,
}: {
  selected: boolean
  title: string
  description: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative rounded-2xl border px-4 py-4 pr-12 text-left transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-border bg-background hover:border-primary/40"
      )}
    >
      <span className="absolute top-4 right-4">
        {selected ? (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3" strokeWidth={3} aria-hidden />
          </span>
        ) : (
          <Circle className="size-5 text-muted-foreground" aria-hidden />
        )}
      </span>
      <span className="block font-semibold text-foreground text-sm">
        {title}
      </span>
      <span className="mt-1 block text-muted-foreground text-xs">
        {description}
      </span>
    </button>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate font-medium text-foreground">{value}</dd>
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
  const hasVideo = episode.media?.status === "ready"
  const accessLabel =
    episode.access === "free"
      ? "Free"
      : episode.access === "premium"
        ? "Premium"
        : "Coins"

  return (
    <li className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground text-sm">
          {episode.title || `Episode ${index + 1}`}
        </p>
        <p className="text-muted-foreground text-xs">
          {episode.duration || "—"} ·{" "}
          {hasVideo ? "Video ready" : "No video yet"}
        </p>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-full px-2.5 py-1 font-medium text-[11px]",
          episode.access === "free"
            ? "bg-[#2BBB7126] text-[#002C0F]"
            : "bg-primary/10 text-primary"
        )}
      >
        {accessLabel}
      </span>
    </li>
  )
}
