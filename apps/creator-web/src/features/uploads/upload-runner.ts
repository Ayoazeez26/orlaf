import {
  getEpisode,
  getEpisodeUploadUrl,
  getSeries,
  getSeriesTrailerUploadUrl,
  getTrailerStatus,
  getWizardTrailerUploadUrl,
  updateSeries,
} from "@/features/projects/api/studio-api"
import { convertForUpload } from "@/features/projects/lib/media/convert-for-upload"
import {
  isAbortError,
  PauseGate,
  uploadVideo,
  videoResumeKey,
} from "@/features/projects/lib/media/video-upload"
import {
  addJob,
  getJob,
  getJobs,
  isJobActive,
  removeJob,
  type UploadJob,
  updateJob,
} from "./upload-store"

/**
 * Converting and uploading are bandwidth- and CPU-bound, so only this many run
 * at once; the rest wait as "Queued". Processing happens on Cloudflare and
 * doesn't hold a slot.
 */
const MAX_ACTIVE_UPLOADS = 2

const PROCESSING_POLL_MS = 5_000
/** Stop polling after this; the server finishes processing on its own. */
const PROCESSING_POLL_LIMIT_MS = 30 * 60 * 1000

const controllers = new Map<string, AbortController>()
/** Pause control for jobs that are converting or uploading. */
const gates = new Map<string, PauseGate>()
/** Releases the upload slot a job holds; absent while queued or paused. */
const slotReleases = new Map<string, () => void>()
/** What started each job this session, so a failed upload can be retried. */
const jobInputs = new Map<
  string,
  | { kind: "episode"; input: StartEpisodeUploadInput }
  | { kind: "trailer"; input: StartTrailerUploadInput }
>()
let activeSlots = 0
const slotQueue: Array<() => void> = []

function acquireSlot(signal: AbortSignal): Promise<() => void> {
  return new Promise((resolve, reject) => {
    const grant = () => {
      signal.removeEventListener("abort", onAbort)
      activeSlots += 1
      let released = false
      resolve(() => {
        if (released) return
        released = true
        activeSlots -= 1
        slotQueue.shift()?.()
      })
    }
    const onAbort = () => {
      const index = slotQueue.indexOf(grant)
      if (index >= 0) slotQueue.splice(index, 1)
      reject(new DOMException("Upload aborted", "AbortError"))
    }
    if (signal.aborted) {
      onAbort()
      return
    }
    if (activeSlots < MAX_ACTIVE_UPLOADS) {
      grant()
      return
    }
    signal.addEventListener("abort", onAbort)
    slotQueue.push(grant)
  })
}

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      signal.removeEventListener("abort", onAbort)
      resolve()
    }, ms)
    const onAbort = () => {
      window.clearTimeout(timer)
      reject(new DOMException("Upload aborted", "AbortError"))
    }
    signal.addEventListener("abort", onAbort)
  })
}

function newJobId(kind: string) {
  return `${kind}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function isNotFound(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status?: unknown }).status === 404
  )
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}

/** Stops a job's work (conversion, upload or polling) and drops it. */
/**
 * Pauses a job's byte upload. Its slot goes to the next queued upload, and
 * the server keeps what has already arrived.
 */
export function pauseUpload(jobId: string) {
  const gate = gates.get(jobId)
  const job = getJob(jobId)
  if (!gate || job?.phase !== "uploading" || gate.isPaused) return
  gate.pause()
  slotReleases.get(jobId)?.()
  slotReleases.delete(jobId)
  updateJob(jobId, { phase: "paused" })
}

/** Resumes a paused upload once a slot is free. */
export async function resumeUpload(jobId: string) {
  const gate = gates.get(jobId)
  const controller = controllers.get(jobId)
  const job = getJob(jobId)
  if (!gate || !controller || job?.phase !== "paused") return
  updateJob(jobId, { phase: "queued" })
  try {
    slotReleases.set(jobId, await acquireSlot(controller.signal))
  } catch {
    return // cancelled while waiting
  }
  updateJob(jobId, {
    phase: "uploading",
    // Measure speed afresh from where it resumes.
    bytesAtStart: undefined,
    uploadStartedAt: Date.now(),
  })
  gate.resume()
}

export function cancelUpload(jobId: string) {
  controllers.get(jobId)?.abort()
  controllers.delete(jobId)
  jobInputs.delete(jobId)
  removeJob(jobId)
}

/** Hides a finished, failed or interrupted job from the tray. */
export function dismissUpload(jobId: string) {
  const job = getJob(jobId)
  if (job && isJobActive(job)) return
  cancelUpload(jobId)
}

export function clearFinishedUploads() {
  for (const job of getJobs()) {
    if (job.phase === "ready") removeJob(job.id)
  }
}

interface ResumeOptions {
  destination: string
  /** Confirms the server still expects this video before resuming it. */
  isCurrentVideo: (videoId: string) => Promise<boolean>
}

interface MediaInput {
  file: File
  aiVerticalConversion: boolean
  previewObjectUrl?: string
  durationSeconds?: number
}

/**
 * Shared pipeline: wait for a slot, convert if needed, upload with tus.
 * Returns the Stream video id.
 */
async function convertAndUpload(
  jobId: string,
  signal: AbortSignal,
  media: MediaInput,
  /** Lets a later attempt of the same original file resume this upload. */
  resume: ResumeOptions | undefined,
  getUploadTarget: Parameters<typeof uploadVideo>[0]["getUploadTarget"],
  onVideoId?: (videoId: string) => void
): Promise<string> {
  slotReleases.set(jobId, await acquireSlot(signal))
  const gate = new PauseGate()
  gates.set(jobId, gate)
  try {
    updateJob(jobId, { phase: "converting", progress: 0 })

    // Like byte progress below: a tray and wizard re-render every ~0.25s is
    // plenty, and updating on every event overwhelms React on long videos.
    let lastConvertProgressAt = 0
    const converted = await convertForUpload(media.file, {
      aiVerticalConversion: media.aiVerticalConversion,
      signal,
      onProgress: (update) => {
        const now = Date.now()
        if (update.value < 1 && now - lastConvertProgressAt < 250) return
        lastConvertProgressAt = now
        updateJob(jobId, { progress: update.value })
      },
    })

    updateJob(jobId, {
      phase: "uploading",
      progress: 0,
      bytesUploaded: 0,
      bytesTotal: converted.blob.size,
      uploadStartedAt: Date.now(),
      bytesAtStart: undefined,
      ...(converted.durationSeconds != null && {
        durationSeconds: converted.durationSeconds,
      }),
    })

    let lastProgressAt = 0
    const { videoId } = await uploadVideo({
      blob: converted.blob,
      fileName: converted.fileName,
      signal,
      // Only the untouched original can be resumed; a re-encode differs
      // byte for byte each run.
      resumeKey:
        resume && !converted.converted
          ? videoResumeKey(resume.destination, media.file)
          : undefined,
      canResume: resume?.isCurrentVideo,
      gate,
      getUploadTarget,
      onVideoId: (id) => {
        updateJob(jobId, { videoId: id })
        onVideoId?.(id)
      },
      onProgress: ({ bytesUploaded, bytesTotal }) => {
        const job = getJob(jobId)
        // Byte events fire many times a second; a tray re-render every
        // ~0.25s is plenty.
        const now = Date.now()
        if (
          job?.bytesAtStart !== undefined &&
          bytesUploaded < bytesTotal &&
          now - lastProgressAt < 250
        ) {
          return
        }
        lastProgressAt = now
        updateJob(jobId, {
          bytesUploaded,
          bytesTotal,
          progress: bytesTotal > 0 ? bytesUploaded / bytesTotal : 0,
          // A resumed upload starts part-way; measure speed from there.
          ...(job?.bytesAtStart === undefined && {
            bytesAtStart: bytesUploaded,
            uploadStartedAt: Date.now(),
          }),
        })
      },
    })

    return videoId
  } finally {
    gates.delete(jobId)
    slotReleases.get(jobId)?.()
    slotReleases.delete(jobId)
  }
}

// ---------------------------------------------------------------------------
// Episodes
// ---------------------------------------------------------------------------

export interface StartEpisodeUploadInput extends MediaInput {
  seriesId: string
  episodeId: string
  draftId?: string
  title: string
}

/**
 * Uploads an episode video in the background. Replaces any earlier upload
 * for the same episode.
 */
export function startEpisodeUpload(input: StartEpisodeUploadInput): string {
  for (const job of getJobs()) {
    if (job.kind === "episode" && job.episodeId === input.episodeId) {
      cancelUpload(job.id)
    }
  }

  const jobId = newJobId("episode")
  const controller = new AbortController()
  controllers.set(jobId, controller)

  addJob({
    id: jobId,
    kind: "episode",
    title: input.title,
    seriesId: input.seriesId,
    episodeId: input.episodeId,
    draftId: input.draftId,
    fileName: input.file.name,
    fileSize: input.file.size,
    phase: "queued",
    progress: 0,
    bytesUploaded: 0,
    bytesTotal: input.file.size,
    previewObjectUrl: input.previewObjectUrl,
    durationSeconds: input.durationSeconds,
    createdAt: Date.now(),
  })

  jobInputs.set(jobId, { kind: "episode", input })
  void runEpisodeUpload(jobId, controller.signal, input)
  return jobId
}

async function runEpisodeUpload(
  jobId: string,
  signal: AbortSignal,
  input: StartEpisodeUploadInput
) {
  try {
    await convertAndUpload(
      jobId,
      signal,
      input,
      {
        destination: `episode:${input.episodeId}`,
        isCurrentVideo: async (videoId) =>
          (await getEpisode(input.seriesId, input.episodeId)).videoHostingId ===
          videoId,
      },
      (size) =>
        getEpisodeUploadUrl(input.seriesId, input.episodeId, {
          size,
          fileName: input.file.name,
        })
    )

    updateJob(jobId, { phase: "processing", progress: 1 })

    const deadline = Date.now() + PROCESSING_POLL_LIMIT_MS
    while (Date.now() < deadline) {
      await sleep(PROCESSING_POLL_MS, signal)
      const episode = await getEpisode(input.seriesId, input.episodeId).catch(
        (error: unknown) => (isNotFound(error) ? "deleted" : null)
      )
      if (episode === "deleted") {
        // The episode was deleted; nothing left to track.
        removeJob(jobId)
        return
      }
      if (!episode) continue
      if (episode.status === "ready") {
        updateJob(jobId, {
          phase: "ready",
          hlsUrl: episode.hlsUrl ?? undefined,
          ...(episode.durationSeconds != null && {
            durationSeconds: episode.durationSeconds,
          }),
        })
        return
      }
      if (episode.status === "failed") {
        throw new Error("Cloudflare could not process this video")
      }
    }
    updateJob(jobId, { processingInBackground: true })
  } catch (error) {
    if (signal.aborted || isAbortError(error)) return
    updateJob(jobId, {
      phase: "failed",
      error: errorMessage(error, "Episode upload failed"),
    })
  } finally {
    controllers.delete(jobId)
  }
}

// ---------------------------------------------------------------------------
// Trailers
// ---------------------------------------------------------------------------

export interface StartTrailerUploadInput extends MediaInput {
  /** Null in the new-series wizard, before the series exists. */
  seriesId: string | null
  /** The new-series wizard that owns this upload while seriesId is null. */
  wizardId?: string
  title: string
  /** Called once the trailer has an HLS URL. */
  onReady?: (hlsUrl: string) => void
}

/** Uploads a series trailer in the background. */
export function startTrailerUpload(input: StartTrailerUploadInput): string {
  const previous = findTrailerJob(getJobs(), input)
  if (previous) cancelUpload(previous.id)

  const jobId = newJobId("trailer")
  const controller = new AbortController()
  controllers.set(jobId, controller)

  addJob({
    id: jobId,
    kind: "trailer",
    title: input.title,
    seriesId: input.seriesId,
    wizardId: input.wizardId,
    fileName: input.file.name,
    fileSize: input.file.size,
    phase: "queued",
    progress: 0,
    bytesUploaded: 0,
    bytesTotal: input.file.size,
    previewObjectUrl: input.previewObjectUrl,
    durationSeconds: input.durationSeconds,
    createdAt: Date.now(),
  })

  jobInputs.set(jobId, { kind: "trailer", input })
  void runTrailerUpload(jobId, controller.signal, input)
  return jobId
}

async function runTrailerUpload(
  jobId: string,
  signal: AbortSignal,
  input: StartTrailerUploadInput
) {
  const createdForSeries = input.seriesId
  try {
    const videoId = await convertAndUpload(
      jobId,
      signal,
      input,
      // Trailers aren't resumed: a series can have several trailer uploads
      // over time and only the latest one is linked to it.
      undefined,
      (size) =>
        createdForSeries
          ? getSeriesTrailerUploadUrl(createdForSeries, {
              size,
              fileName: input.file.name,
            })
          : getWizardTrailerUploadUrl("video/mp4", {
              size,
              fileName: input.file.name,
            })
    )

    updateJob(jobId, { phase: "processing", progress: 1 })

    const deadline = Date.now() + PROCESSING_POLL_LIMIT_MS
    while (Date.now() < deadline) {
      await sleep(PROCESSING_POLL_MS, signal)
      const status = await getTrailerStatus(videoId).catch(() => null)
      if (!status) continue
      if (status.status === "failed") {
        throw new Error("Cloudflare could not process this trailer")
      }
      if (status.status === "ready" && status.hlsUrl) {
        const currentSeriesId = getJob(jobId)?.seriesId
        if (currentSeriesId) {
          await updateSeries(currentSeriesId, {
            trailerUrl: status.hlsUrl,
          }).catch(() => undefined)
        }
        updateJob(jobId, { phase: "ready", hlsUrl: status.hlsUrl })
        input.onReady?.(status.hlsUrl)
        return
      }
    }
    updateJob(jobId, { processingInBackground: true })
  } catch (error) {
    if (signal.aborted || isAbortError(error)) return
    updateJob(jobId, {
      phase: "failed",
      error: errorMessage(error, "Trailer upload failed"),
    })
  } finally {
    controllers.delete(jobId)
  }
}

/** True when a failed job can be retried without picking the file again. */
export function canRetryWithoutFile(jobId: string) {
  return jobInputs.has(jobId)
}

/**
 * Retries a failed or interrupted upload. Without `file`, reuses the file
 * from this session; after a reload the creator has to pick it again (the
 * browser can't reopen it), and a matching file resumes where it stopped.
 */
export async function retryUpload(jobId: string, file?: File) {
  const job = getJob(jobId)
  if (!job || isJobActive(job)) return
  const previous = jobInputs.get(jobId)

  if (job.kind === "episode") {
    if (!job.seriesId || !job.episodeId) return
    const aiVerticalConversion =
      previous?.input.aiVerticalConversion ??
      (await getEpisode(job.seriesId, job.episodeId)).aiVerticalConversion
    const media = file ?? previous?.input.file
    if (!media) return
    cancelUpload(jobId)
    startEpisodeUpload({
      seriesId: job.seriesId,
      episodeId: job.episodeId,
      draftId: job.draftId,
      title: job.title,
      file: media,
      aiVerticalConversion,
      previewObjectUrl: job.previewObjectUrl,
    })
    return
  }

  const trailerInput = previous?.kind === "trailer" ? previous.input : null
  const media = file ?? trailerInput?.file
  if (!media || (!job.seriesId && !trailerInput)) return
  const aiVerticalConversion =
    trailerInput?.aiVerticalConversion ??
    (job.seriesId ? (await getSeries(job.seriesId)).aiVerticalConversion : true)
  cancelUpload(jobId)
  startTrailerUpload({
    seriesId: job.seriesId,
    wizardId: job.wizardId,
    title: job.title,
    file: media,
    aiVerticalConversion,
    previewObjectUrl: job.previewObjectUrl,
    onReady: trailerInput?.onReady,
  })
}

/**
 * The trailer job for a series, or — before the series exists — for one
 * new-series wizard. Keying on the wizard keeps an abandoned wizard's trailer
 * from showing up in the next one.
 */
export function findTrailerJob(
  jobs: readonly UploadJob[],
  owner: { seriesId: string | null; wizardId?: string }
): UploadJob | undefined {
  return jobs.find(
    (job) =>
      job.kind === "trailer" &&
      (owner.seriesId
        ? job.seriesId === owner.seriesId
        : !job.seriesId && job.wizardId === owner.wizardId)
  )
}

/** The job currently tracking an episode or draft, if any. */
export function findEpisodeJob(
  jobs: readonly UploadJob[],
  ids: { episodeId?: string; draftId?: string }
): UploadJob | undefined {
  return jobs.find(
    (job) =>
      job.kind === "episode" &&
      ((ids.episodeId && job.episodeId === ids.episodeId) ||
        (ids.draftId && job.draftId === ids.draftId))
  )
}
