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
 * In-browser conversion re-encodes every frame and holds the whole output in
 * memory. A 500 MB, 9-minute 1080p file took over 3 minutes on a fast laptop
 * before any byte reached Cloudflare, and slower machines look frozen or run
 * out of memory. Above this size, MP4/MOV files Cloudflare can ingest are
 * uploaded as they are (Cloudflare transcodes them; no 9:16 crop is applied).
 */
export const MAX_IN_BROWSER_CONVERT_BYTES = 200 * 1024 * 1024

/** Reading a file's metadata should take seconds; never block an upload on it. */
export const PROBE_METADATA_TIMEOUT_MS = 30_000

/** Decoding a preview frame is optional; give up quickly on slow codecs. */
export const PROBE_THUMBNAIL_TIMEOUT_MS = 8_000
