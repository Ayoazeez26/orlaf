import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Switch } from "@workspace/ui/components/switch"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"
import {
  Check,
  ChevronLeft,
  Clapperboard,
  Coins,
  FileText,
  Film,
  Globe,
  HelpCircle,
  ImageIcon,
  Keyboard,
  Lock,
  Plus,
  Sparkles,
  Tag,
  Trash2,
  Users,
} from "lucide-react"
import { useLayoutEffect, useRef } from "react"
import { SelectionCard } from "@/features/onboarding/components/selection-card"
import {
  LANGUAGE_OPTIONS,
  SUBTITLE_TRACK_OPTIONS,
  UPLOAD_SERIES_TIPS,
} from "../../constants"
import { FROSTED_CARD_SURFACE_CLASS } from "../../constants/frosted-card"
import {
  canContinueFromInfo,
  useContinueFromInfo,
} from "../../hooks/use-continue-from-info"
import { usePosterTrailerUpload } from "../../hooks/use-poster-trailer-upload"
import { usePublicGenres } from "../../hooks/use-public-genres"
import { MAX_TRAILER_FILE_BYTES } from "../../lib/media/upload-pipeline.types"
import type { PersonEntry } from "../../types"
import { useUploadWizard } from "../../upload/upload-wizard-context"
import { UploadInfoSectionCard } from "./upload-info-section-card"
import { ImageUploadZone, VideoUploadZone } from "./video-upload-zone"

interface UploadSeriesInfoStepProps {
  onNext: () => void | Promise<void>
}

export function UploadSeriesInfoStep({ onNext }: UploadSeriesInfoStepProps) {
  const { state, dispatch } = useUploadWizard()
  const { data: genreOptions = [], isLoading: genresLoading } =
    usePublicGenres()
  const { uploadPoster, uploadTrailer, clearPoster, clearTrailer } =
    usePosterTrailerUpload()
  const { continueFromInfo } = useContinueFromInfo()

  const canContinue = canContinueFromInfo(state)

  async function handleContinue() {
    const ok = await continueFromInfo()
    if (ok) await onNext()
  }

  return (
    <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
      <div className="w-full min-w-0 max-w-[740px] space-y-6">
        <UploadInfoSectionCard
          icon={FileText}
          title="Basics"
          subtitle="Tell us about your project."
        >
          <div className="space-y-2">
            <Label>Project type</Label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <SelectionCard
                icon={Clapperboard}
                title="Short series"
                description="Multi-episode vertical series."
                selected={state.projectType === "short-series"}
                onClick={() =>
                  dispatch({
                    type: "SET_FIELD",
                    payload: { projectType: "short-series" },
                  })
                }
              />
              <SelectionCard
                icon={Film}
                title="Short film"
                description="Single vertical short film."
                selected={state.projectType === "short-film"}
                onClick={() =>
                  dispatch({
                    type: "SET_FIELD",
                    payload: { projectType: "short-film" },
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="series-title">Title</Label>
            <Input
              id="series-title"
              className="bg-input-bg"
              placeholder="e.g. Lagos After Dark"
              value={state.title}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  payload: { title: e.target.value },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="synopsis">Synopsis</Label>
            <p className="text-muted-foreground text-xs">
              A short logline that will appear on the player.
            </p>
            <Textarea
              id="synopsis"
              className="min-h-28 bg-input-bg"
              placeholder="What is your story about?"
              value={state.synopsis}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  payload: { synopsis: e.target.value },
                })
              }
            />
          </div>
        </UploadInfoSectionCard>

        <UploadInfoSectionCard
          icon={ImageIcon}
          title="Artwork & Trailer"
          subtitle="Vertical poster and optional trailer."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <ImageUploadZone
              label="Film poster"
              hint="9:16 vertical · JPG / PNG · up to 10MB"
              aspectRatio="9/16"
              previewUrl={state.poster?.previewObjectUrl ?? null}
              status={state.poster?.status}
              progress={state.poster?.progress}
              error={state.poster?.error}
              onSelect={(file, previewUrl) =>
                void uploadPoster(file, previewUrl)
              }
              onClear={clearPoster}
            />
            <VideoUploadZone
              label="Trailer"
              hint="9:16 vertical · MP4 / MOV · up to 100MB"
              aspectRatio="9/16"
              media={state.trailer}
              maxBytes={MAX_TRAILER_FILE_BYTES}
              onSelect={(file) => void uploadTrailer(file)}
              onClear={clearTrailer}
            />
          </div>
        </UploadInfoSectionCard>

        <UploadInfoSectionCard
          icon={Tag}
          title="Genre"
          subtitle="Pick up to 3 genres that describe your project."
        >
          <div className="flex flex-wrap gap-2">
            {genresLoading ? (
              <p className="text-muted-foreground text-sm">Loading genres…</p>
            ) : (
              genreOptions.map((genre) => (
                <ToggleChip
                  key={genre.id}
                  label={genre.name}
                  selected={state.genres.includes(genre.name)}
                  onClick={() =>
                    dispatch({ type: "TOGGLE_GENRE", payload: genre.name })
                  }
                />
              ))
            )}
          </div>
        </UploadInfoSectionCard>

        <UploadInfoSectionCard
          icon={Globe}
          title="Language & Subtitles"
          subtitle="Set the primary language and offered subtitles."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <Label>Primary language</Label>
              <Select
                value={state.language}
                onValueChange={(language) =>
                  dispatch({ type: "SET_FIELD", payload: { language } })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Auto-caption</Label>
              <p className="text-muted-foreground text-xs">
                Let Sable AI generate subtitles automatically.
              </p>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Keyboard className="size-4 text-primary" aria-hidden />
                  <span className="font-medium text-foreground text-sm">
                    Enabled
                  </span>
                </div>
                <Switch
                  checked={state.autoCaptionEnabled}
                  onCheckedChange={(autoCaptionEnabled) =>
                    dispatch({
                      type: "SET_FIELD",
                      payload: { autoCaptionEnabled },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Subtitle tracks</Label>
            <p className="text-muted-foreground text-xs">
              Choose which subtitle languages to publish.
            </p>
            <div className="flex flex-wrap gap-2">
              {SUBTITLE_TRACK_OPTIONS.map((track) => (
                <ToggleChip
                  key={track}
                  label={track}
                  selected={state.subtitleTracks.includes(track)}
                  onClick={() =>
                    dispatch({ type: "TOGGLE_SUBTITLE", payload: track })
                  }
                />
              ))}
            </div>
          </div>
        </UploadInfoSectionCard>

        <UploadInfoSectionCard
          icon={Users}
          title="Cast"
          subtitle="Who stars in your project?"
        >
          <PersonEntryList list="cast" entries={state.cast} />
        </UploadInfoSectionCard>

        <UploadInfoSectionCard
          icon={Clapperboard}
          title="Crew"
          subtitle="Director, writer, producer, and more."
        >
          <PersonEntryList list="crew" entries={state.crew} />
        </UploadInfoSectionCard>

        <div className="flex items-center justify-between gap-3 border-t pt-6">
          <Button type="button" variant="outline" className="gap-1" disabled>
            <ChevronLeft className="size-4" aria-hidden />
            Back
          </Button>
          <div className="flex flex-col items-end gap-2">
            <Button
              type="button"
              disabled={!canContinue}
              onClick={() => void handleContinue()}
            >
              {state.isContinuing ? "Saving…" : "Continue"}
            </Button>
          </div>
        </div>
      </div>

      <aside className="flex min-w-0 flex-col gap-6 xl:sticky xl:top-8">
        <SidebarOptionCard
          icon={Lock}
          title="Access"
          subtitle="Make this project free or coin-gated."
        >
          <AccessOption
            title="Free"
            description="Anyone on Sable can watch."
            selected={state.access === "free"}
            onClick={() =>
              dispatch({ type: "SET_FIELD", payload: { access: "free" } })
            }
          />
          <AccessOption
            title="Coin gated"
            description="Viewers spend coins to unlock."
            icon={Coins}
            selected={state.access === "coins"}
            onClick={() =>
              dispatch({ type: "SET_FIELD", payload: { access: "coins" } })
            }
          />
        </SidebarOptionCard>

        <SidebarOptionCard
          icon={Sparkles}
          title="AI Vertical Conversion"
          subtitle="Reframe horizontal footage to 9:16."
        >
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex gap-2">
              <Sparkles className="size-4 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="font-medium text-foreground text-sm">
                  Auto-reframe to 9:16
                </p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Sable AI tracks subjects and crops your video for vertical
                  playback.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 border-primary/20 border-t pt-4">
              <span className="text-foreground text-sm">
                AI conversion enabled
              </span>
              <Switch
                checked={state.aiConversionEnabled}
                onCheckedChange={(aiConversionEnabled) =>
                  dispatch({
                    type: "SET_FIELD",
                    payload: { aiConversionEnabled },
                  })
                }
              />
            </div>
          </div>
        </SidebarOptionCard>

        <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <HelpCircle className="size-4" aria-hidden />
              </span>
              <p className="font-semibold text-foreground text-sm">Tips</p>
            </div>
            <ul className="space-y-3">
              {UPLOAD_SERIES_TIPS.map((tip) => (
                <li
                  key={tip}
                  className="flex gap-2 text-muted-foreground text-sm"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden
                  />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}

function ToggleChip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium text-sm transition-colors",
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-foreground hover:border-muted-foreground/40"
      )}
    >
      {selected && <Check className="size-3.5" aria-hidden />}
      {label}
    </button>
  )
}

function PersonEntryList({
  list,
  entries,
}: {
  list: "cast" | "crew"
  entries: PersonEntry[]
}) {
  const { dispatch } = useUploadWizard()
  const rolePlaceholder = list === "crew" ? "Director" : "e.g. Ada"
  const nameInputRefs = useRef(new Map<string, HTMLInputElement>())
  const pendingFocusRef = useRef(false)
  const prevCountRef = useRef(entries.length)

  useLayoutEffect(() => {
    if (!pendingFocusRef.current || entries.length <= prevCountRef.current) {
      prevCountRef.current = entries.length
      return
    }

    pendingFocusRef.current = false
    prevCountRef.current = entries.length
    const newEntry = entries[entries.length - 1]
    nameInputRefs.current.get(newEntry.id)?.focus()
  }, [entries])

  function handleAdd() {
    pendingFocusRef.current = true
    dispatch({ type: "ADD_PERSON", payload: list })
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <Input
            ref={(element) => {
              if (element) {
                nameInputRefs.current.set(entry.id, element)
              } else {
                nameInputRefs.current.delete(entry.id)
              }
            }}
            className="bg-input-bg sm:flex-1"
            placeholder="Full name"
            value={entry.name}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_PERSON",
                payload: {
                  list,
                  id: entry.id,
                  patch: { name: e.target.value },
                },
              })
            }
          />
          <Input
            className="bg-input-bg sm:flex-1"
            placeholder={rolePlaceholder}
            value={entry.role}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_PERSON",
                payload: {
                  list,
                  id: entry.id,
                  patch: { role: e.target.value },
                },
              })
            }
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            disabled={entries.length <= 1}
            onClick={() =>
              dispatch({
                type: "REMOVE_PERSON",
                payload: { list, id: entry.id },
              })
            }
            aria-label={`Remove ${list} member`}
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={handleAdd}
      >
        <Plus className="size-4" aria-hidden />
        Add {list} member
      </Button>
    </div>
  )
}

function SidebarOptionCard({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: LucideIcon
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-5" aria-hidden />
          </span>
          <div>
            <p className="font-semibold text-foreground text-sm">{title}</p>
            <p className="text-muted-foreground text-xs">{subtitle}</p>
          </div>
        </div>
        <div className="space-y-3">{children}</div>
      </CardContent>
    </Card>
  )
}

function AccessOption({
  title,
  description,
  selected,
  onClick,
  icon: Icon,
}: {
  title: string
  description: string
  selected: boolean
  onClick: () => void
  icon?: LucideIcon
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex w-full flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-border bg-input-bg hover:border-muted-foreground/40"
      )}
    >
      {selected && (
        <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" strokeWidth={3} aria-hidden />
        </span>
      )}
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon
            className={cn(
              "size-4",
              selected ? "text-primary" : "text-muted-foreground"
            )}
            aria-hidden
          />
        )}
        <p className="font-medium text-foreground text-sm">{title}</p>
      </div>
      <p className="text-muted-foreground text-xs">{description}</p>
    </button>
  )
}
