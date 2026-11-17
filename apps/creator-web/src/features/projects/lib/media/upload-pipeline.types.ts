export type MediaJobPhase =
  | "idle"
  | "probing"
  | "queued"
  | "converting"
  | "uploading"
  | "paused"
  | "processing"
  | "ready"
  | "failed"

export type MediaJobStatus = MediaJobPhase

export interface MediaProgressUpdate {
  phase: MediaJobPhase
  /** Progress within the current phase (0–1). */
  value: number
}

export interface ConvertForUploadOptions {
  aiVerticalConversion: boolean
  onProgress?: (update: MediaProgressUpdate) => void
  signal?: AbortSignal
}

export interface ConvertForUploadResult {
  blob: Blob
  fileName: string
  /** False when the original file is uploaded untouched. */
  converted: boolean
  durationSeconds: number | null
  width: number | null
  height: number | null
}

export interface ProbeMediaResult {
  durationSeconds: number | null
  width: number | null
  height: number | null
  hasVideo: boolean
  hasAudio: boolean
  thumbnailObjectUrl: string | null
}

/**
 * Match the server: the upload-url endpoint accepts up to 2 GB, and Cloudflare
 * Stream is told to reject anything over 10 minutes (MAX_DURATION_SECONDS in
 * the backend's Cloudflare provider).
 */
export const MAX_EPISODE_FILE_BYTES = 2 * 1024 * 1024 * 1024
export const MAX_TRAILER_FILE_BYTES = 2 * 1024 * 1024 * 1024
export const MAX_VIDEO_DURATION_SECONDS = 10 * 60

/**
 * In-browser conversion holds the whole output in memory. Above this size,
 * upload the original and let Cloudflare transcode it instead.
 */
export const MAX_IN_BROWSER_CONVERT_BYTES = 750 * 1024 * 1024
