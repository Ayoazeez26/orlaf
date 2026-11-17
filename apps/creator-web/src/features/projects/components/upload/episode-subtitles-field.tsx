import type { EpisodeCaptionsResponse, VideoCaption } from "@sable/contracts"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"
import { Loader2, Sparkles, Subtitles, X } from "lucide-react"
import { useRef, useState } from "react"
import {
  deleteEpisodeCaptions,
  generateEpisodeCaptions,
  getEpisodeCaptions,
  uploadEpisodeCaptions,
} from "../../api/studio-api"
import { LANGUAGE_OPTIONS } from "../../constants"
import type { UploadEpisodeDraft } from "../../types"

/** The server's JSON body limit leaves room for about this much text. */
const MAX_SUBTITLE_FILE_BYTES = 95_000

/** Check again this often while Cloudflare is still transcribing. */
const POLL_WHILE_GENERATING_MS = 15_000

interface EpisodeSubtitlesFieldProps {
  seriesId: string | null
  episode: UploadEpisodeDraft
  seriesLanguage: string
  autoCaptionEnabled: boolean
}

function captionsQueryKey(seriesId: string, episodeId: string, videoId = "") {
  return ["episode-captions", seriesId, episodeId, videoId] as const
}

function captionStatus(caption: VideoCaption) {
  if (caption.status === "inprogress") return "Generating…"
  if (caption.status === "error") return "Couldn't generate"
  return caption.generated ? "Auto-generated" : "Uploaded"
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}

/**
 * Subtitle tracks for one episode. Tracks are stored on the episode's
 * Cloudflare video and listed in its stream, so players offer them as
 * subtitles. AI captions are added automatically when "Auto captions" is on;
 * creators can also upload .srt or .vtt files in any language.
 */
export function EpisodeSubtitlesField({
  seriesId,
  episode,
  seriesLanguage,
  autoCaptionEnabled,
}: EpisodeSubtitlesFieldProps) {
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [language, setLanguage] = useState(seriesLanguage || "English")
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const episodeId = episode.backendEpisodeId
  const mediaStatus = episode.media?.status
  // Cloudflare only accepts subtitles for a video it has received.
  const videoSent = mediaStatus === "processing" || mediaStatus === "ready"
  const enabled = Boolean(seriesId && episodeId && videoSent)
  const queryKey = captionsQueryKey(
    seriesId ?? "",
    episodeId ?? "",
    episode.media?.videoHostingId
  )

  const query = useQuery({
    queryKey,
    queryFn: () => getEpisodeCaptions(seriesId ?? "", episodeId ?? ""),
    enabled,
    refetchInterval: (current) =>
      current.state.data?.captions.some((c) => c.status === "inprogress")
        ? POLL_WHILE_GENERATING_MS
        : false,
  })

  const data = query.data
  const captions = data?.captions ?? []
  const hasGenerated = captions.some((caption) => caption.generated)
  const canGenerate =
    autoCaptionEnabled &&
    mediaStatus === "ready" &&
    data?.autoCaptionLanguage != null &&
    !hasGenerated

  async function run(
    key: string,
    action: () => Promise<EpisodeCaptionsResponse>,
    fallback: string
  ) {
    setBusy(key)
    setError(null)
    try {
      queryClient.setQueryData(queryKey, await action())
    } catch (caught) {
      setError(errorMessage(caught, fallback))
    } finally {
      setBusy(null)
    }
  }

  async function handleFile(file: File) {
    if (!seriesId || !episodeId) return
    if (file.size > MAX_SUBTITLE_FILE_BYTES) {
      setError("Subtitle file is too large. Keep it under 95 KB.")
      return
    }
    const content = await file.text()
    await run(
      "upload",
      () => uploadEpisodeCaptions(seriesId, episodeId, language, { content }),
      "Couldn't upload subtitles"
    )
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="font-medium text-sm text-text-strong">Subtitles</p>
        <p className="text-muted-foreground text-xs">
          {autoCaptionEnabled
            ? "Captions are generated automatically once the video is processed. You can also upload .srt or .vtt files, in any language."
            : "Upload .srt or .vtt files, in any language. Viewers pick them from the player."}
        </p>
      </div>

      {!enabled ? (
        <p className="rounded-2xl border border-dashed px-4 py-3 text-muted-foreground text-sm">
          Upload the episode video first. Subtitles are added to the video once
          it has finished sending.
        </p>
      ) : (
        <>
          {autoCaptionEnabled && data && data.autoCaptionLanguage == null ? (
            <p className="text-muted-foreground text-xs">
              Automatic captions aren't available for {seriesLanguage}. Upload a
              subtitle file instead.
            </p>
          ) : null}

          {query.isLoading ? (
            <p className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Loading subtitles…
            </p>
          ) : captions.length > 0 ? (
            <ul className="space-y-2">
              {captions.map((caption) => (
                <li
                  key={caption.language}
                  className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-2.5"
                >
                  <Subtitles
                    className="size-4 shrink-0 text-foreground"
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground text-sm">
                      {caption.label}
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        caption.status === "error"
                          ? "text-destructive"
                          : "text-muted-foreground"
                      )}
                    >
                      {captionStatus(caption)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={busy != null}
                    aria-label={`Remove ${caption.label} subtitles`}
                    onClick={() =>
                      seriesId && episodeId
                        ? void run(
                            `delete:${caption.language}`,
                            () =>
                              deleteEpisodeCaptions(
                                seriesId,
                                episodeId,
                                caption.language
                              ),
                            "Couldn't remove subtitles"
                          )
                        : undefined
                    }
                  >
                    {busy === `delete:${caption.language}` ? (
                      <Loader2 className="animate-spin" aria-hidden />
                    ) : (
                      <X aria-hidden />
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          ) : mediaStatus === "processing" && autoCaptionEnabled ? (
            <p className="text-muted-foreground text-xs">
              Captions start once the video finishes processing.
            </p>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger
                className="h-11 sm:w-40"
                aria-label="Subtitle language"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              type="button"
              disabled={busy != null}
              onClick={() => inputRef.current?.click()}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-input-bg/50 px-4 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:opacity-60"
            >
              {busy === "upload" ? (
                <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
              ) : (
                <Subtitles className="size-4 shrink-0" aria-hidden />
              )}
              <span className="text-sm">
                {busy === "upload" ? "Uploading…" : "Upload .srt or .vtt"}
              </span>
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".srt,.vtt,text/vtt,application/x-subrip"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ""
              if (file) void handleFile(file)
            }}
          />

          {canGenerate ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy != null}
              onClick={() =>
                seriesId && episodeId
                  ? void run(
                      "generate",
                      () => generateEpisodeCaptions(seriesId, episodeId),
                      "Couldn't start captions"
                    )
                  : undefined
              }
            >
              <Sparkles aria-hidden />
              {busy === "generate" ? "Starting…" : "Generate captions"}
            </Button>
          ) : null}
        </>
      )}

      {error ? (
        <p className="text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
