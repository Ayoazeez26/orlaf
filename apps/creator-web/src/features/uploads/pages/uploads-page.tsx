import type {
  StudioPendingSubmission,
  StudioUploadItem,
} from "@sable/contracts"
import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import {
  AlertCircle,
  CheckCircle2,
  Clapperboard,
  Clock,
  Film,
  Loader2,
} from "lucide-react"
import type { ReactNode } from "react"
import { useEffect } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { formatDuration } from "@/features/projects/lib/media/format-duration"
import { UploadRow } from "../components/upload-row"
import { clearFinishedUploads } from "../upload-runner"
import { isJobActive, type UploadJob, useUploadJobs } from "../upload-store"
import { fetchStudioUploads, uploadsQueryKey } from "../uploads-api"

/** Refresh the server list this often while anything is still in flight. */
const REFRESH_WHILE_BUSY_MS = 10_000

function Section({
  title,
  description,
  action,
  children,
}: {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-semibold text-foreground text-lg">{title}</h2>
          {description ? (
            <p className="text-muted-foreground text-sm">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className={cn(FROSTED_CARD_SURFACE_CLASS, "overflow-hidden")}>
        {children}
      </div>
    </section>
  )
}

function formatWhen(iso: string) {
  const date = new Date(iso)
  const minutes = Math.round((Date.now() - date.getTime()) / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  return date.toLocaleDateString()
}

function serverStatusText(item: StudioUploadItem) {
  switch (item.status) {
    case "uploading":
      return "Upload didn't finish. If it isn't still uploading on another device, upload it again."
    case "processing":
      return "Processing on Cloudflare. No need to keep this page open."
    case "failed":
      return "Cloudflare couldn't process this video. Upload it again."
    case "ready":
      return `Ready${item.durationSeconds ? ` · ${formatDuration(item.durationSeconds)}` : ""}`
  }
}

function ServerItemIcon({ item }: { item: StudioUploadItem }) {
  if (item.status === "ready") {
    return <CheckCircle2 className="size-4 text-primary" aria-hidden />
  }
  if (item.status === "failed" || item.status === "uploading") {
    return <AlertCircle className="size-4 text-destructive" aria-hidden />
  }
  if (item.status === "processing") {
    return (
      <Loader2
        className="size-4 animate-spin text-muted-foreground"
        aria-hidden
      />
    )
  }
  return item.kind === "trailer" ? (
    <Film className="size-4 text-muted-foreground" aria-hidden />
  ) : (
    <Clapperboard className="size-4 text-muted-foreground" aria-hidden />
  )
}

function ServerItemRow({ item }: { item: StudioUploadItem }) {
  const needsUpload = item.status === "failed" || item.status === "uploading"
  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <div className="pt-0.5">
        <ServerItemIcon item={item} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground text-sm">
          {item.seriesTitle} · {item.title}
        </p>
        <p
          className={cn(
            "text-xs",
            needsUpload ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {serverStatusText(item)}
        </p>
        <p className="text-muted-foreground text-xs">
          Updated {formatWhen(item.updatedAt)}
        </p>
      </div>
      {needsUpload ? (
        <Button variant="outline" size="xs" asChild>
          <Link
            to="/dashboard/projects/new"
            search={{
              seriesId: item.seriesId,
              step: item.kind === "trailer" ? "info" : "episodes",
            }}
          >
            Upload again
          </Link>
        </Button>
      ) : (
        <Button variant="ghost" size="xs" asChild>
          <Link
            to="/dashboard/projects/$projectId"
            params={{ projectId: item.seriesId }}
          >
            View
          </Link>
        </Button>
      )}
    </li>
  )
}

function PendingSubmissionRow({
  submission,
}: {
  submission: StudioPendingSubmission
}) {
  const remaining = submission.episodesRemaining
  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <div className="pt-0.5">
        <Clock className="size-4 text-muted-foreground" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground text-sm">
          {submission.seriesTitle}
        </p>
        <p className="text-muted-foreground text-xs">
          {remaining > 0
            ? `Goes to review when ${remaining} more ${remaining === 1 ? "episode finishes" : "episodes finish"} processing.`
            : "Going to review now."}{" "}
          Submitted {formatWhen(submission.submitRequestedAt)}.
        </p>
      </div>
      <Button variant="ghost" size="xs" asChild>
        <Link
          to="/dashboard/projects/$projectId"
          params={{ projectId: submission.seriesId }}
        >
          View
        </Link>
      </Button>
    </li>
  )
}

/** True when this browser is tracking the same video. */
function isTrackedLocally(item: StudioUploadItem, jobs: readonly UploadJob[]) {
  return jobs.some((job) =>
    item.kind === "episode"
      ? job.kind === "episode" && job.episodeId === item.id
      : job.kind === "trailer" && job.seriesId === item.seriesId
  )
}

/**
 * Every video upload in one place: what this browser is sending right now
 * (with pause, resume and cancel), what Cloudflare is still processing,
 * what failed, and what finished recently — across all projects and
 * devices.
 */
export function UploadsPage() {
  const jobs = useUploadJobs()
  const anyLocalActive = jobs.some(
    (job) => isJobActive(job) || job.phase === "processing"
  )

  const query = useQuery({
    queryKey: uploadsQueryKey,
    queryFn: fetchStudioUploads,
    refetchInterval: (current) => {
      const data = current.state.data
      const serverBusy =
        data?.items.some(
          (item) => item.status === "processing" || item.status === "uploading"
        ) || (data?.pendingSubmissions.length ?? 0) > 0
      return serverBusy || anyLocalActive ? REFRESH_WHILE_BUSY_MS : false
    },
  })

  // A local upload finishing changes the server's view; refresh right away.
  const localPhases = jobs.map((job) => `${job.id}:${job.phase}`).join(",")
  const { refetch } = query
  useEffect(() => {
    if (localPhases) void refetch()
  }, [localPhases, refetch])

  const serverItems = (query.data?.items ?? []).filter(
    (item) => !isTrackedLocally(item, jobs)
  )
  const needsAttention = serverItems.filter(
    (item) => item.status === "failed" || item.status === "uploading"
  )
  const processing = serverItems.filter((item) => item.status === "processing")
  const finished = serverItems.filter((item) => item.status === "ready")
  const pendingSubmissions = query.data?.pendingSubmissions ?? []
  const localReady = jobs.some((job) => job.phase === "ready")

  const nothingAtAll =
    jobs.length === 0 &&
    serverItems.length === 0 &&
    pendingSubmissions.length === 0

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Uploads
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Track your episode and trailer videos from upload to ready.
        </p>
      </div>

      {jobs.length > 0 ? (
        <Section
          title="In this browser"
          description={
            jobs.some(isJobActive)
              ? "Keep this tab open until these finish sending. Pausing keeps what's already uploaded."
              : undefined
          }
          action={
            localReady ? (
              <Button variant="ghost" size="sm" onClick={clearFinishedUploads}>
                Clear finished
              </Button>
            ) : null
          }
        >
          <ul className="divide-y">
            {[...jobs].reverse().map((job) => (
              <UploadRow key={job.id} job={job} />
            ))}
          </ul>
        </Section>
      ) : null}

      {pendingSubmissions.length > 0 ? (
        <Section
          title="Waiting to go to review"
          description="Submitted while videos were processing. These go to review automatically."
        >
          <ul className="divide-y">
            {pendingSubmissions.map((submission) => (
              <PendingSubmissionRow
                key={submission.seriesId}
                submission={submission}
              />
            ))}
          </ul>
        </Section>
      ) : null}

      {needsAttention.length > 0 ? (
        <Section title="Needs attention">
          <ul className="divide-y">
            {needsAttention.map((item) => (
              <ServerItemRow key={`${item.kind}-${item.id}`} item={item} />
            ))}
          </ul>
        </Section>
      ) : null}

      {processing.length > 0 ? (
        <Section
          title="Processing"
          description="Cloudflare is preparing these for playback."
        >
          <ul className="divide-y">
            {processing.map((item) => (
              <ServerItemRow key={`${item.kind}-${item.id}`} item={item} />
            ))}
          </ul>
        </Section>
      ) : null}

      {finished.length > 0 ? (
        <Section title="Recently finished" description="From the last 7 days.">
          <ul className="divide-y">
            {finished.map((item) => (
              <ServerItemRow key={`${item.kind}-${item.id}`} item={item} />
            ))}
          </ul>
        </Section>
      ) : null}

      {query.isLoading && jobs.length === 0 ? (
        <p className="text-muted-foreground text-sm">Loading uploads…</p>
      ) : query.isError ? (
        <p className="text-destructive text-sm" role="alert">
          Couldn't load uploads from the server.{" "}
          <button
            type="button"
            className="underline"
            onClick={() => void query.refetch()}
          >
            Try again
          </button>
        </p>
      ) : nothingAtAll ? (
        <div className={cn(FROSTED_CARD_SURFACE_CLASS, "p-6 text-center")}>
          <p className="font-medium text-foreground">No uploads right now</p>
          <p className="mt-1 text-muted-foreground text-sm">
            Videos you upload to your projects show up here while they upload
            and process.
          </p>
          <Button className="mt-4" asChild>
            <Link to="/dashboard/projects/new">Upload a project</Link>
          </Button>
        </div>
      ) : null}
    </div>
  )
}
