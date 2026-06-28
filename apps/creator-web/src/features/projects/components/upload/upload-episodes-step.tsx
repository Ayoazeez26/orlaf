import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"
import {
  Check,
  Clapperboard,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Plus,
  Sparkles,
  Subtitles,
  Trash2,
  Volume2,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { deleteEpisode } from "../../api/studio-api"
import { useEpisodeAutosave } from "../../hooks/use-episode-autosave"
import { useEpisodeMediaUpload } from "../../hooks/use-episode-media-upload"
import { useSaveUploadDraft } from "../../hooks/use-save-upload-draft"
import { formatUploadGenres } from "../../lib/format-upload-genres"
import { MAX_EPISODE_FILE_BYTES } from "../../lib/media/upload-pipeline.types"
import type { EpisodeAccess, UploadEpisodeDraft } from "../../types"
import { useUploadWizard } from "../../upload/upload-wizard-context"
import { UploadSeriesPreviewAside } from "./upload-series-preview-aside"
import { UploadEpisodesStepNav } from "./upload-step-nav"
import { VideoUploadZone } from "./video-upload-zone"

const ACCESS_OPTIONS: { value: EpisodeAccess; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "coins", label: "Coin-Gated" },
  { value: "premium", label: "Premium" },
]

interface UploadEpisodesStepProps {
  onBack: () => void
  onNext: () => void
  initialExpandedEpisodeId?: string
}

export function UploadEpisodesStep({
  onBack,
  onNext,
  initialExpandedEpisodeId,
}: UploadEpisodesStepProps) {
  const { state, dispatch, previewImage } = useUploadWizard()
  const saveDraft = useSaveUploadDraft()
  const { uploadEpisode, clearEpisode } = useEpisodeMediaUpload()
  useEpisodeAutosave(state.episodes, state.seriesId)
  const [expandedEpisode, setExpandedEpisode] = useState(
    initialExpandedEpisodeId ?? state.episodes[0]?.id
  )
  const episodeCountRef = useRef(state.episodes.length)
  const [deletingEpisodeId, setDeletingEpisodeId] = useState<string | null>(
    null
  )

  useEffect(() => {
    if (state.episodes.length > episodeCountRef.current) {
      const newest = state.episodes[state.episodes.length - 1]
      if (newest) setExpandedEpisode(newest.id)
    }
    episodeCountRef.current = state.episodes.length
  }, [state.episodes])

  async function handleDeleteEpisode(episode: UploadEpisodeDraft) {
    if (deletingEpisodeId) return

    const seriesId = state.seriesId
    const backendEpisodeId = episode.backendEpisodeId

    if (!seriesId || !backendEpisodeId) {
      dispatch({ type: "REMOVE_EPISODE", payload: { id: episode.id } })
      return
    }

    setDeletingEpisodeId(episode.id)
    try {
      await deleteEpisode(seriesId, backendEpisodeId)
      dispatch({ type: "REMOVE_EPISODE", payload: { id: episode.id } })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete episode"
      alert(message)
    } finally {
      setDeletingEpisodeId(null)
    }
  }

  const displayTitle = state.title.trim() || "The Returnees"
  const toolbarButtonClassName =
    "text-text-strong hover:text-text-strong aria-expanded:text-text-strong px-3 py-2"

  return (
    <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-foreground text-lg">
              {displayTitle}
            </h2>
            <p className="text-sm text-text-subtle">
              {state.episodes.length} episodes added
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Button
              variant="outline"
              size="lg"
              className={toolbarButtonClassName}
              onClick={() => dispatch({ type: "TOGGLE_GUIDE" })}
            >
              {state.guideVisible ? (
                <>
                  <EyeOff className="size-4" aria-hidden />
                  Hide Guide
                </>
              ) : (
                <>
                  <Eye className="size-4" aria-hidden />
                  Show Guide
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className={toolbarButtonClassName}
              size="lg"
              onClick={saveDraft}
            >
              <FileText className="size-4" aria-hidden />
              Save Draft
            </Button>
            <Button
              variant="outline"
              className={toolbarButtonClassName}
              onClick={() => dispatch({ type: "ADD_EPISODES", payload: 1 })}
              size="lg"
            >
              <Plus className="size-4" aria-hidden />
              Add New Episode
            </Button>
          </div>
        </div>

        {state.guideVisible && <UploadGuideCard />}

        <Card className="border-dashed py-4 shadow-none">
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-foreground text-sm">
                Add Bulk Episodes
              </p>
              <p className="mt-1 text-muted-foreground text-xs">
                Quickly add multiple episode slots
              </p>
            </div>
            <div className="flex gap-2">
              {[5, 10, 20].map((count) => (
                <Button
                  key={count}
                  variant="outline"
                  className="rounded-lg px-3 py-2"
                  onClick={() =>
                    dispatch({ type: "ADD_EPISODES", payload: count })
                  }
                >
                  +{count}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Accordion
          type="single"
          collapsible
          value={expandedEpisode}
          onValueChange={setExpandedEpisode}
          className="space-y-3"
        >
          {state.episodes.map((episode, index) => (
            <AccordionItem
              key={episode.id}
              value={episode.id}
              className="overflow-hidden rounded-[24px] border bg-card"
            >
              <div className="grid grid-cols-[1fr_auto] items-center">
                <AccordionTrigger className="items-center px-6 py-5 hover:no-underline">
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-sm text-text-strong">
                      {index + 1}
                    </span>
                    <div className="min-w-0 space-y-1 text-left">
                      <p className="truncate font-semibold text-[15px] text-text-strong">
                        {episode.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-text-subtle">
                        <span>
                          Ep {index + 1} · {episode.duration}
                        </span>
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary text-xs">
                          9:16 Vertical
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <button
                  type="button"
                  onClick={() => void handleDeleteEpisode(episode)}
                  disabled={deletingEpisodeId === episode.id}
                  aria-label={`Delete ${episode.title}`}
                  className="mr-6 flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
                >
                  {deletingEpisodeId === episode.id ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Trash2 className="size-4" aria-hidden />
                  )}
                </button>
              </div>
              <AccordionContent className="border-t px-6 pt-6 pb-6">
                <div className="space-y-5">
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="space-y-3">
                      <Label className="font-medium text-sm text-text-strong">
                        Upload Episode
                      </Label>
                      <VideoUploadZone
                        label=""
                        hint="MP4, MOV • Max 500MB"
                        media={episode.media}
                        maxBytes={MAX_EPISODE_FILE_BYTES}
                        onSelect={(file) =>
                          void uploadEpisode(episode.id, file)
                        }
                        onClear={() => clearEpisode(episode.id)}
                      />
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-3">
                        <Label className="font-medium text-sm text-text-strong">
                          Episode Title
                        </Label>
                        <Input
                          className="mt-2 h-[52px] rounded-2xl bg-input-bg text-base text-text-strong dark:bg-input-bg"
                          value={episode.title}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_EPISODE",
                              payload: {
                                id: episode.id,
                                patch: { title: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="font-medium text-sm text-text-strong">
                          Synopsis
                        </Label>
                        <Textarea
                          rows={4}
                          className="mt-2 min-h-[104px] rounded-2xl bg-input-bg px-4 py-3 text-base text-text-strong dark:bg-input-bg"
                          value={episode.synopsis}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_EPISODE",
                              payload: {
                                id: episode.id,
                                patch: { synopsis: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border bg-background p-5">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-bold text-text-subtle text-xs uppercase tracking-[0.16em]">
                        Advanced Settings
                      </p>
                      <Switch defaultChecked />
                    </div>

                    <div className="mt-6 space-y-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-start">
                        <div className="flex items-center gap-3">
                          <Sparkles
                            className="size-4 text-primary"
                            aria-hidden
                          />
                          <p className="font-medium text-sm text-text-strong">
                            Access
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 lg:ml-9">
                          {ACCESS_OPTIONS.map((opt) => (
                            <Button
                              key={opt.value}
                              type="button"
                              variant="outline"
                              onClick={() =>
                                dispatch({
                                  type: "UPDATE_EPISODE",
                                  payload: {
                                    id: episode.id,
                                    patch: { access: opt.value },
                                  },
                                })
                              }
                              className={cn(
                                "flex h-8 items-center justify-center rounded-full border px-4 pt-0.5 font-medium text-xs leading-none transition-colors",
                                episode.access === opt.value
                                  ? "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground dark:border-primary dark:bg-primary dark:hover:bg-primary dark:hover:text-primary-foreground"
                                  : "border-border bg-card text-text-subtle hover:bg-muted"
                              )}
                            >
                              {opt.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-3">
                          <Subtitles
                            className="size-4 text-primary"
                            aria-hidden
                          />
                          <div>
                            <p className="mb-1! font-medium text-sm text-text-strong">
                              Subtitles
                            </p>
                            <p className="text-sm text-text-subtle">
                              Auto-caption enabled · SRT / VTT
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            className="h-10 rounded-full border-transparent bg-upload-step-complete px-4 text-primary hover:bg-upload-step-complete/80 hover:text-primary"
                          >
                            <Check className="size-4" aria-hidden />
                            Auto Caption
                          </Button>
                          <Button
                            variant="outline"
                            className="h-10 rounded-xl bg-transparent px-4 text-text-strong hover:text-text-strong"
                          >
                            Upload Subtitle
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <UploadEpisodesStepNav
          onBack={onBack}
          onNext={onNext}
          className="hidden xl:flex"
        />
      </div>

      <div className="flex flex-col gap-6">
        <UploadSeriesPreviewAside
          title={displayTitle}
          genre={formatUploadGenres(state.genres)}
          synopsis={state.synopsis}
          posterUrl={previewImage}
          trailerUrl={state.trailerUrl}
          episodes={state.episodes}
          activeEpisodeId={expandedEpisode}
        />
        <UploadEpisodesStepNav
          onBack={onBack}
          onNext={onNext}
          className="xl:hidden"
        />
      </div>
    </div>
  )
}

function UploadGuideCard() {
  const sections = [
    {
      title: "Video",
      icon: Clapperboard,
      items: [
        "Vertical 9:16 (1080×1920px)",
        "MP4/MOV, H.264/H.265",
        "Max 500MB per episode",
        "1-10 min recommended",
      ],
    },
    {
      title: "Sound",
      icon: Volume2,
      items: [
        "AAC stereo 128kbps+",
        "Normalize to -14 LUFS",
        "Clear dialogue separation",
      ],
    },
    {
      title: "Subtitles",
      icon: Subtitles,
      items: [
        "SRT or VTT format",
        "Auto-caption available",
        "Multi-language supported",
      ],
    },
  ] as const

  return (
    <div className="rounded-3xl border bg-background p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <Sparkles className="size-5 text-primary" aria-hidden />
        <p className="font-semibold text-[15px] text-text-strong">
          Upload Guide
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon

          return (
            <div
              key={section.title}
              className="rounded-2xl border bg-card px-4 py-4 shadow-[0_1px_2px_rgba(23,23,28,0.04)]"
            >
              <div className="mb-3 flex items-center gap-2.5">
                <Icon className="size-4 text-primary" aria-hidden />
                <p className="font-semibold text-text-strong">
                  {section.title}
                </p>
              </div>
              <ul className="space-y-1 pl-4 text-text-subtle text-xs leading-7">
                {section.items.map((item) => (
                  <li key={item} className="list-disc">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
