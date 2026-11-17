import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Progress } from "@workspace/ui/components/progress"
import { cn } from "@workspace/ui/lib/utils"
import {
  AlertCircle,
  CheckCircle2,
  Clapperboard,
  Film,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  X,
} from "lucide-react"
import { useRef } from "react"
import {
  cancelUpload,
  canRetryWithoutFile,
  dismissUpload,
  pauseUpload,
  resumeUpload,
  retryUpload,
} from "../upload-runner"
import { isJobActive, type UploadJob } from "../upload-store"

export function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

function formatTimeLeft(seconds: number) {
  if (seconds < 60) return "less than a minute left"
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min left`
  const hours = Math.floor(minutes / 60)
  return `${hours} h ${minutes % 60} min left`
}

function uploadDetail(job: UploadJob) {
  const sent = `${formatBytes(job.bytesUploaded)} of ${formatBytes(job.bytesTotal)}`
  if (!job.uploadStartedAt || job.bytesAtStart === undefined) return sent
  const elapsed = (Date.now() - job.uploadStartedAt) / 1000
  const sentThisSession = job.bytesUploaded - job.bytesAtStart
  // Wait for a few seconds of data before estimating.
  if (elapsed < 3 || sentThisSession <= 0) return sent
  const rate = sentThisSession / elapsed
  const remaining = (job.bytesTotal - job.bytesUploaded) / rate
  return `${sent} · ${formatTimeLeft(remaining)}`
}

function statusLine(job: UploadJob) {
  switch (job.phase) {
    case "queued":
      return "Waiting for other uploads…"
    case "converting":
      return `Preparing video… ${Math.round(job.progress * 100)}%`
    case "uploading":
      return uploadDetail(job)
    case "paused":
      return `Paused · ${formatBytes(job.bytesUploaded)} of ${formatBytes(job.bytesTotal)}`
    case "processing":
      return job.processingInBackground
        ? "Still processing. You can close this page."
        : "Processing. You can close this page."
    case "ready":
      return "Ready"
    case "failed":
      return job.error ?? "Upload failed"
    case "interrupted":
      return "Stopped when the page closed. Choose the same file to continue."
  }
}

function JobIcon({ job }: { job: UploadJob }) {
  if (job.phase === "ready") {
    return <CheckCircle2 className="size-4 text-primary" aria-hidden />
  }
  if (job.phase === "failed" || job.phase === "interrupted") {
    return <AlertCircle className="size-4 text-destructive" aria-hidden />
  }
  if (job.phase === "processing") {
    return (
      <Loader2
        className="size-4 animate-spin text-muted-foreground"
        aria-hidden
      />
    )
  }
  return job.kind === "trailer" ? (
    <Film className="size-4 text-muted-foreground" aria-hidden />
  ) : (
    <Clapperboard className="size-4 text-muted-foreground" aria-hidden />
  )
}

/** One upload with its status, progress and controls. */
export function UploadRow({ job }: { job: UploadJob }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const needsFile =
    job.phase === "interrupted" ||
    (job.phase === "failed" && !canRetryWithoutFile(job.id))
  const showProgress =
    job.phase === "converting" ||
    job.phase === "uploading" ||
    job.phase === "paused"

  const retry = () => {
    if (needsFile) {
      fileInputRef.current?.click()
      return
    }
    void retryUpload(job.id)
  }

  return (
    <li className="space-y-2 px-4 py-3">
      {/* On narrow screens the buttons drop below the text instead of
          squeezing the title. */}
      <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
        <div className="pt-0.5">
          <JobIcon job={job} />
        </div>
        <div className="min-w-[55%] flex-1">
          <p className="truncate font-medium text-foreground text-sm">
            {job.title}
          </p>
          <p
            className={cn(
              "text-xs",
              job.phase === "failed" || job.phase === "interrupted"
                ? "text-destructive"
                : "text-muted-foreground"
            )}
          >
            {statusLine(job)}
          </p>
          {job.phase === "interrupted" ? (
            <p className="truncate text-muted-foreground text-xs">
              {job.fileName}
            </p>
          ) : null}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1">
          {job.phase === "uploading" ? (
            <Button
              variant="ghost"
              size="icon-xs"
              className="max-sm:size-9"
              onClick={() => pauseUpload(job.id)}
              aria-label={`Pause ${job.title}`}
            >
              <Pause aria-hidden />
            </Button>
          ) : null}
          {job.phase === "paused" ? (
            <Button
              variant="outline"
              size="xs"
              className="max-sm:h-9"
              onClick={() => void resumeUpload(job.id)}
              aria-label={`Resume ${job.title}`}
            >
              <Play aria-hidden />
              Resume
            </Button>
          ) : null}
          {job.phase === "failed" || job.phase === "interrupted" ? (
            <Button
              variant="outline"
              size="xs"
              className="max-sm:h-9"
              onClick={retry}
              aria-label={`Retry ${job.title}`}
            >
              <RotateCcw aria-hidden />
              {needsFile ? "Choose file" : "Retry"}
            </Button>
          ) : null}
          {job.phase === "ready" && job.seriesId ? (
            <Button variant="ghost" size="xs" className="max-sm:h-9" asChild>
              <Link
                to="/dashboard/projects/$projectId"
                params={{ projectId: job.seriesId }}
              >
                View
              </Link>
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="icon-xs"
            className="max-sm:size-9"
            onClick={() =>
              isJobActive(job) ? cancelUpload(job.id) : dismissUpload(job.id)
            }
            aria-label={
              isJobActive(job)
                ? `Cancel upload of ${job.title}`
                : `Dismiss ${job.title}`
            }
          >
            <X aria-hidden />
          </Button>
        </div>
      </div>
      {showProgress ? (
        <Progress
          value={job.progress * 100}
          className={cn(job.phase === "paused" && "opacity-50")}
          aria-label={`${job.title} progress`}
        />
      ) : null}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ""
          if (file) void retryUpload(job.id, file)
        }}
      />
    </li>
  )
}
