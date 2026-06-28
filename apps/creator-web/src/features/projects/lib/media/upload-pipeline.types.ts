export type MediaJobPhase =
  | "idle"
  | "probing"
  | "converting"
  | "uploading"
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

export const MAX_EPISODE_FILE_BYTES = 500 * 1024 * 1024
export const MAX_TRAILER_FILE_BYTES = 100 * 1024 * 1024
export const MAX_VIDEO_DURATION_SECONDS = 5 * 60
