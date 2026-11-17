import { useSyncExternalStore } from "react"

/**
 * App-wide upload state. Lives outside React so uploads keep running, and
 * stay visible in the upload tray, while the creator moves around the
 * dashboard.
 */

export type UploadJobKind = "episode" | "trailer"

export type UploadJobPhase =
  | "queued"
  | "converting"
  | "uploading"
  /** The creator paused the byte upload; resumes from where it stopped. */
  | "paused"
  | "processing"
  | "ready"
  | "failed"
  /** The page closed mid-upload; the creator can pick the file again. */
  | "interrupted"

export interface UploadJob {
  id: string
  kind: UploadJobKind
  /** Shown in the tray, e.g. "Episode 2 · The Awakening". */
  title: string
  seriesId: string | null
  /** Backend episode id (episodes only). */
  episodeId?: string
  /** Upload wizard draft id, so the wizard can show this job's progress. */
  draftId?: string
  /** New-series wizard that owns a trailer upload before the series exists. */
  wizardId?: string
  fileName: string
  fileSize: number
  phase: UploadJobPhase
  /** Progress within the current phase, 0–1. */
  progress: number
  bytesUploaded: number
  bytesTotal: number
  /** When byte upload started, for speed and time-left estimates. */
  uploadStartedAt?: number
  /** Bytes already on the server when this session started (resumed upload). */
  bytesAtStart?: number
  videoId?: string
  hlsUrl?: string
  durationSeconds?: number
  previewObjectUrl?: string
  error?: string
  /** Processing outlasted polling; the server finishes it on its own. */
  processingInBackground?: boolean
  createdAt: number
}

/** Phases where the browser holds the work and must stay open. */
export const ACTIVE_PHASES: ReadonlySet<UploadJobPhase> = new Set([
  "queued",
  "converting",
  "uploading",
  "paused",
])

export function isJobActive(job: UploadJob) {
  return ACTIVE_PHASES.has(job.phase)
}

const PERSIST_KEY = "sable.uploadJobs.v1"

type PersistedJob = Pick<
  UploadJob,
  | "id"
  | "kind"
  | "title"
  | "seriesId"
  | "episodeId"
  | "fileName"
  | "fileSize"
  | "createdAt"
>

let jobs: UploadJob[] = loadInterruptedJobs()
const listeners = new Set<() => void>()

function loadInterruptedJobs(): UploadJob[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    if (!raw) return []
    const persisted = JSON.parse(raw) as PersistedJob[]
    return persisted
      .filter((job) => job.kind === "episode" || job.seriesId)
      .map((job) => ({
        ...job,
        phase: "interrupted" as const,
        progress: 0,
        bytesUploaded: 0,
        bytesTotal: job.fileSize,
        error: "Upload stopped when the page closed.",
      }))
  } catch {
    return []
  }
}

/** Remembers in-flight uploads so a reload can offer to resume them. */
function persist() {
  try {
    const unfinished: PersistedJob[] = jobs
      .filter((job) => isJobActive(job) || job.phase === "interrupted")
      .map(
        ({
          id,
          kind,
          title,
          seriesId,
          episodeId,
          fileName,
          fileSize,
          createdAt,
        }) => ({
          id,
          kind,
          title,
          seriesId,
          episodeId,
          fileName,
          fileSize,
          createdAt,
        })
      )
    localStorage.setItem(PERSIST_KEY, JSON.stringify(unfinished))
  } catch {
    // Storage is optional.
  }
}

function emit(phaseChanged: boolean) {
  if (phaseChanged) persist()
  for (const listener of listeners) listener()
}

export function getJobs(): readonly UploadJob[] {
  return jobs
}

export function getJob(id: string): UploadJob | undefined {
  return jobs.find((job) => job.id === id)
}

export function addJob(job: UploadJob) {
  jobs = [...jobs.filter((existing) => existing.id !== job.id), job]
  emit(true)
}

export function updateJob(id: string, patch: Partial<UploadJob>) {
  let phaseChanged = false
  jobs = jobs.map((job) => {
    if (job.id !== id) return job
    if (patch.phase && patch.phase !== job.phase) phaseChanged = true
    return { ...job, ...patch }
  })
  emit(phaseChanged || "seriesId" in patch)
}

export function removeJob(id: string) {
  jobs = jobs.filter((job) => job.id !== id)
  emit(true)
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useUploadJobs(): readonly UploadJob[] {
  return useSyncExternalStore(subscribe, getJobs, getJobs)
}
