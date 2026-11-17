/**
 * Cloudflare Stream serves a still from any point of a video at
 * `<host>/<uid>/thumbnails/thumbnail.jpg`. Its playback URLs share the same
 * host and uid (`<host>/<uid>/manifest/video.m3u8`), so the thumbnail URL can
 * be built from the HLS URL the server already returns.
 */
const MANIFEST_PATH = /\/manifest\/[^/?#]+\.m3u8(?:[?#].*)?$/

export interface StreamThumbnailOptions {
  /** Point in the video, in seconds. Defaults to the first frame. */
  timeSeconds?: number
  width?: number
  height?: number
}

export function streamThumbnailUrl(
  hlsUrl: string | null | undefined,
  options: StreamThumbnailOptions = {}
): string | null {
  if (!hlsUrl || !MANIFEST_PATH.test(hlsUrl)) return null
  const url = new URL(
    hlsUrl.replace(MANIFEST_PATH, "/thumbnails/thumbnail.jpg")
  )
  if (options.timeSeconds != null) {
    url.searchParams.set(
      "time",
      `${Math.max(0, Math.round(options.timeSeconds))}s`
    )
  }
  if (options.width) url.searchParams.set("width", String(options.width))
  if (options.height) url.searchParams.set("height", String(options.height))
  if (options.width && options.height) url.searchParams.set("fit", "crop")
  return url.toString()
}

/**
 * The first frame is often black (a fade in). A second in, or a tenth of the
 * way through a short clip, is usually a real picture.
 */
export function previewFrameTime(durationSeconds: number | null | undefined) {
  if (!durationSeconds || !Number.isFinite(durationSeconds)) return 1
  return Math.min(1, durationSeconds * 0.1)
}
