import type { UploadUrlResponse } from "@sable/contracts"
import { DetailedError, Upload } from "tus-js-client"
import { uploadToCloudflareStream } from "../../api/studio-upload"

/**
 * Cloudflare requires tus chunks to be a multiple of 256 KiB, between 5 MiB
 * and 200 MiB. 50 MiB is their recommendation: big enough to be fast, small
 * enough that a dropped connection only re-sends a little.
 */
const CHUNK_SIZE = 50 * 1024 * 1024

/** tus-js-client retries each failed chunk after these delays (ms). */
const RETRY_DELAYS = [0, 1_000, 3_000, 5_000, 10_000, 20_000, 30_000, 60_000]

/**
 * After the retries above run out (about two minutes), wait this long for the
 * connection to come back before giving up. Covers Wi-Fi drops and a laptop
 * lid closing mid-upload.
 */
const OFFLINE_WAIT_MS = 10 * 60 * 1000

/** Restart a chunk request after this long with no bytes moving. */
const STALL_TIMEOUT_MS = 60_000
const MAX_STALL_RESTARTS = 5

/** Upload URLs live 6h server-side; stop resuming a little before that. */
const RESUME_TTL_MS = 5.5 * 60 * 60 * 1000

const RESUME_STORAGE_KEY = "sable.videoUploads.v1"

export interface VideoUploadProgress {
  bytesUploaded: number
  bytesTotal: number
}

export interface UploadVideoOptions {
  blob: Blob
  fileName: string
  /** Mints an upload URL on the server for a file of `size` bytes. */
  getUploadTarget: (size: number) => Promise<UploadUrlResponse>
  onProgress?: (progress: VideoUploadProgress) => void
  /** Called as soon as the server has assigned the video id. */
  onVideoId?: (videoId: string) => void
  signal?: AbortSignal
  /**
   * Identifies this file + destination so a later attempt (after a reload,
   * or picking the same file again) resumes the same upload. Only pass it
   * when `blob` is the user's original file: a re-encoded blob differs byte
   * for byte between runs and must never be resumed.
   */
  resumeKey?: string
  /**
   * Confirms the server still expects this video before an earlier upload
   * is resumed (say, another device has since started a new one).
   */
  canResume?: (videoId: string) => Promise<boolean>
  /** Lets the creator pause and resume the byte upload. */
  gate?: PauseGate
}

interface StoredUpload {
  uploadUrl: string
  videoId: string
  size: number
  createdAt: number
}

function readStore(): Record<string, StoredUpload> {
  try {
    const raw = localStorage.getItem(RESUME_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, StoredUpload>
    const now = Date.now()
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([, entry]) => now - entry.createdAt < RESUME_TTL_MS
      )
    )
  } catch {
    return {}
  }
}

function writeStore(store: Record<string, StoredUpload>) {
  try {
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(store))
  } catch {
    // Resuming is a convenience; uploads still work without storage.
  }
}

function rememberUpload(key: string, entry: StoredUpload) {
  writeStore({ ...readStore(), [key]: entry })
}

function forgetUpload(key: string) {
  const store = readStore()
  delete store[key]
  writeStore(store)
}

/** Stable key for a picked file going to a given destination. */
export function videoResumeKey(destination: string, file: File) {
  return `${destination}:${file.name}:${file.size}:${file.lastModified}`
}

/** True when an unfinished upload of this file can be picked up again. */
export function hasResumableUpload(key: string, size: number) {
  return readStore()[key]?.size === size
}

function abortError() {
  return new DOMException("Upload aborted", "AbortError")
}

function httpStatus(error: unknown): number | null {
  if (error instanceof DetailedError) {
    return error.originalResponse?.getStatus() ?? null
  }
  return null
}

/** The upload URL is gone or expired; a new one is needed. */
function isDeadUploadUrl(error: unknown) {
  const status = httpStatus(error)
  return status === 403 || status === 404 || status === 410
}

/**
 * Retry network failures, server errors, and the 4xx codes that mean "try
 * again later". Other 4xx responses won't change on a retry.
 */
function isRetryable(error: unknown) {
  const status = httpStatus(error) ?? 0
  if (status === 0 || status >= 500) return navigator.onLine
  return status === 409 || status === 423 || status === 429
}

function waitForOnline(signal?: AbortSignal): Promise<boolean> {
  if (navigator.onLine) return Promise.resolve(true)
  return new Promise((resolve) => {
    const done = (result: boolean) => {
      window.clearTimeout(timer)
      window.removeEventListener("online", onOnline)
      signal?.removeEventListener("abort", onAbort)
      resolve(result)
    }
    const onOnline = () => done(true)
    const onAbort = () => done(false)
    const timer = window.setTimeout(() => done(false), OFFLINE_WAIT_MS)
    window.addEventListener("online", onOnline)
    signal?.addEventListener("abort", onAbort)
  })
}

/**
 * Pauses and resumes an upload. Pausing drops the in-flight request; resuming
 * asks the server how much it already has and continues from there.
 */
export class PauseGate {
  private paused = false
  private readonly listeners = new Set<(paused: boolean) => void>()

  get isPaused() {
    return this.paused
  }

  pause() {
    if (this.paused) return
    this.paused = true
    for (const listener of this.listeners) listener(true)
  }

  resume() {
    if (!this.paused) return
    this.paused = false
    for (const listener of this.listeners) listener(false)
  }

  subscribe(listener: (paused: boolean) => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }
}

function runTus(
  blob: Blob,
  uploadUrl: string,
  fileName: string,
  onProgress: UploadVideoOptions["onProgress"],
  signal: AbortSignal | undefined,
  gate: PauseGate | undefined
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError())
      return
    }

    let settled = false
    const settle = (error?: unknown) => {
      if (settled) return
      settled = true
      signal?.removeEventListener("abort", onAbort)
      unsubscribeGate?.()
      if (error) reject(error)
      else resolve()
    }

    const upload = new Upload(blob, {
      // The server already created the upload; tus HEADs this URL to find
      // the offset, so a resumed upload continues where it stopped.
      uploadUrl,
      chunkSize: CHUNK_SIZE,
      retryDelays: RETRY_DELAYS,
      metadata: { name: fileName },
      storeFingerprintForResuming: false,
      onShouldRetry: (error) => isRetryable(error),
      onProgress: (bytesUploaded, bytesTotal) => {
        lastActivity = Date.now()
        onProgress?.({ bytesUploaded, bytesTotal })
      },
      onSuccess: () => {
        window.clearInterval(watchdog)
        settle()
      },
      onError: (error) => {
        window.clearInterval(watchdog)
        settle(error)
      },
    })

    const onAbort = () => {
      window.clearInterval(watchdog)
      void upload.abort(false)
      settle(abortError())
    }
    signal?.addEventListener("abort", onAbort)

    // A connection can hang without ever erroring. If no bytes move for a
    // while, drop the request and start again; tus asks the server for its
    // offset, so nothing already sent is re-sent.
    let lastActivity = Date.now()
    let stallRestarts = 0
    const watchdog = window.setInterval(() => {
      if (settled) {
        window.clearInterval(watchdog)
        return
      }
      if (gate?.isPaused) return
      if (Date.now() - lastActivity < STALL_TIMEOUT_MS) return
      if (stallRestarts >= MAX_STALL_RESTARTS) {
        window.clearInterval(watchdog)
        void upload.abort(false)
        settle(new Error("Upload stalled: the connection stopped responding"))
        return
      }
      stallRestarts += 1
      lastActivity = Date.now()
      void upload.abort(false).then(() => {
        if (!settled) upload.start()
      })
    }, 5_000)

    // Pause aborts the request but keeps the upload on the server; resume
    // calls start(), which HEADs the URL for the offset and carries on.
    let pendingAbort: Promise<void> = Promise.resolve()
    const unsubscribeGate = gate?.subscribe((paused) => {
      if (settled) return
      if (paused) {
        pendingAbort = upload.abort(false).catch(() => undefined)
        return
      }
      void pendingAbort.then(() => {
        if (settled || gate.isPaused) return
        lastActivity = Date.now()
        upload.start()
      })
    })

    if (!gate?.isPaused) upload.start()
  })
}

/**
 * Uploads a video straight to Cloudflare Stream. Uses resumable tus uploads:
 * chunks are retried on failure, the upload waits out short offline spells,
 * and with a `resumeKey` it continues an earlier attempt of the same file
 * instead of starting over.
 */
export async function uploadVideo(
  options: UploadVideoOptions
): Promise<{ videoId: string }> {
  const { blob, fileName, signal, resumeKey } = options
  const size = blob.size

  let stored = resumeKey ? readStore()[resumeKey] : undefined
  if (stored && stored.size !== size) stored = undefined
  if (stored && options.canResume) {
    const current = await options.canResume(stored.videoId).catch(() => false)
    if (!current && resumeKey) {
      forgetUpload(resumeKey)
      stored = undefined
    }
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (signal?.aborted) throw abortError()

    const target: UploadUrlResponse & { resumed?: boolean } = stored
      ? {
          uploadUrl: stored.uploadUrl,
          videoId: stored.videoId,
          protocol: "tus",
          resumed: true,
        }
      : await options.getUploadTarget(size)
    stored = undefined

    options.onVideoId?.(target.videoId)

    if (target.protocol !== "tus") {
      // Older server: one-shot multipart POST, no resume.
      await uploadToCloudflareStream(
        target.uploadUrl,
        blob,
        (fraction) =>
          options.onProgress?.({
            bytesUploaded: Math.round(fraction * size),
            bytesTotal: size,
          }),
        fileName
      )
      return { videoId: target.videoId }
    }

    if (resumeKey && !target.resumed) {
      rememberUpload(resumeKey, {
        uploadUrl: target.uploadUrl,
        videoId: target.videoId,
        size,
        createdAt: Date.now(),
      })
    }

    try {
      for (;;) {
        try {
          await runTus(
            blob,
            target.uploadUrl,
            fileName,
            options.onProgress,
            signal,
            options.gate
          )
          break
        } catch (error) {
          if (signal?.aborted || isDeadUploadUrl(error)) throw error
          // Retries ran out while offline: wait for the connection, then
          // carry on from the last chunk the server confirmed.
          if (navigator.onLine || !(await waitForOnline(signal))) throw error
        }
      }
      if (resumeKey) forgetUpload(resumeKey)
      return { videoId: target.videoId }
    } catch (error) {
      if (signal?.aborted) throw abortError()
      if (!isDeadUploadUrl(error)) throw error
      // The URL expired or was replaced: forget it and start a fresh upload.
      if (resumeKey) forgetUpload(resumeKey)
    }
  }

  throw new Error("Upload failed: the upload link kept expiring")
}

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError"
}
