import { Progress } from "@workspace/ui/components/progress"
import { cn } from "@workspace/ui/lib/utils"
import { Upload, X } from "lucide-react"
import { type DragEvent, useRef } from "react"
import { formatMediaDuration } from "../../hooks/use-media-upload-pipeline"
import type { MediaJobStatus, UploadMediaAsset } from "../../types"

const STATUS_LABELS: Record<MediaJobStatus, string> = {
  idle: "",
  probing: "Analyzing…",
  converting: "Converting…",
  uploading: "Uploading…",
  processing: "Processing…",
  ready: "Ready",
  failed: "Failed",
}

interface VideoUploadZoneProps {
  label: string
  hint: string
  accept?: string
  media: UploadMediaAsset | null
  maxBytes: number
  onSelect: (file: File) => void
  onClear: () => void
  disabled?: boolean
}

export function VideoUploadZone({
  label,
  hint,
  accept = "video/*",
  media,
  maxBytes,
  onSelect,
  onClear,
  disabled,
}: VideoUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isBusy =
    media != null &&
    media.status !== "ready" &&
    media.status !== "failed" &&
    media.status !== "idle"

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    if (file.size > maxBytes) {
      alert(
        `File exceeds the size limit (${Math.round(maxBytes / (1024 * 1024))}MB)`
      )
      return
    }
    onSelect(file)
  }

  const dropZoneClassName = cn(
    "relative flex min-h-52 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed bg-input-bg/50 px-4 py-8 text-center transition-colors",
    disabled || isBusy
      ? "cursor-not-allowed opacity-80"
      : "cursor-pointer hover:border-primary/40 hover:bg-primary/5"
  )

  const handleDragOver = (e: DragEvent) => e.preventDefault()
  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    if (!disabled && !isBusy) handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-2">
      <div>
        {label ? (
          <>
            <p className="font-medium text-foreground text-sm">{label}</p>
            <p className="text-muted-foreground text-xs">{hint}</p>
          </>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled || isBusy}
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ""
        }}
      />
      {media?.file ? (
        <div className={dropZoneClassName}>
          {media.previewObjectUrl ? (
            <img
              src={media.previewObjectUrl}
              alt=""
              className="absolute inset-0 size-full object-cover opacity-40"
            />
          ) : null}
          <div className="relative z-10 w-full max-w-xs space-y-2">
            <p className="font-medium text-foreground text-sm">
              {media.file.name}
            </p>
            <p className="text-muted-foreground text-xs">
              {formatMediaDuration(media.durationSeconds ?? null)}
            </p>
            {media.status !== "idle" && media.status !== "ready" ? (
              <div className="space-y-1.5">
                <p className="text-muted-foreground text-xs">
                  {STATUS_LABELS[media.status]}
                  {media.error ? `: ${media.error}` : ""}
                </p>
                {media.status !== "failed" ? (
                  <Progress value={media.progress * 100} className="h-1.5" />
                ) : null}
              </div>
            ) : null}
            {media.status === "ready" ? (
              <p className="font-medium text-primary text-xs">Ready</p>
            ) : null}
          </div>
          <button
            type="button"
            className="relative z-10 rounded-full bg-background/90 p-1.5"
            disabled={isBusy}
            onClick={onClear}
          >
            <X className="size-4" aria-hidden />
            <span className="sr-only">Remove file</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled || isBusy}
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={dropZoneClassName}
        >
          <Upload className="size-5 text-muted-foreground" aria-hidden />
          <span className="text-muted-foreground text-sm">
            Click to upload or drag and drop
          </span>
        </button>
      )}
    </div>
  )
}

interface ImageUploadZoneProps {
  label: string
  hint: string
  previewUrl: string | null
  status?: MediaJobStatus
  progress?: number
  error?: string
  onSelect: (file: File, previewUrl: string) => void
  onClear: () => void
  maxBytes?: number
}

export function ImageUploadZone({
  label,
  hint,
  previewUrl,
  status,
  progress = 0,
  error,
  onSelect,
  onClear,
  maxBytes = 10 * 1024 * 1024,
}: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isBusy =
    status != null &&
    status !== "ready" &&
    status !== "failed" &&
    status !== "idle"

  const dropZoneClassName = cn(
    "relative flex min-h-52 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed bg-input-bg/50 px-4 py-8 text-center transition-colors",
    isBusy
      ? "cursor-not-allowed opacity-80"
      : "cursor-pointer hover:border-primary/40 hover:bg-primary/5"
  )

  const handleDragOver = (e: DragEvent) => e.preventDefault()
  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    if (!isBusy) {
      const file = e.dataTransfer.files?.[0]
      if (file) {
        if (file.size > maxBytes) {
          alert("Image exceeds 10MB limit")
          return
        }
        onSelect(file, URL.createObjectURL(file))
      }
    }
  }

  return (
    <div className="space-y-2">
      <div>
        <p className="font-medium text-foreground text-sm">{label}</p>
        <p className="text-muted-foreground text-xs">{hint}</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        disabled={isBusy}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return
          if (file.size > maxBytes) {
            alert("Image exceeds 10MB limit")
            return
          }
          onSelect(file, URL.createObjectURL(file))
          e.target.value = ""
        }}
      />
      {previewUrl ? (
        <div className={dropZoneClassName}>
          <img
            src={previewUrl}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          {status && status !== "idle" && status !== "ready" ? (
            <div className="relative z-10 w-full max-w-xs space-y-1.5 rounded-lg bg-background/90 p-3">
              <p className="text-muted-foreground text-xs">
                {STATUS_LABELS[status]}
                {error ? `: ${error}` : ""}
              </p>
              {status !== "failed" ? (
                <Progress value={progress * 100} className="h-1.5" />
              ) : null}
            </div>
          ) : null}
          {status === "ready" ? (
            <p className="relative z-10 rounded-full bg-background/90 px-3 py-1 font-medium text-primary text-xs">
              Ready
            </p>
          ) : null}
          <button
            type="button"
            className="relative z-10 mt-auto rounded-full bg-background/90 p-1.5"
            disabled={isBusy}
            onClick={onClear}
          >
            <X className="size-4" aria-hidden />
            <span className="sr-only">Remove image</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={isBusy}
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={dropZoneClassName}
        >
          <Upload className="size-5 text-muted-foreground" aria-hidden />
          <span className="text-muted-foreground text-sm">
            Click to upload or drag and drop
          </span>
        </button>
      )}
    </div>
  )
}
