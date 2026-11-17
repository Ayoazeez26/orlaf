import {
  BlobSource,
  CanvasSink,
  Input,
  MATROSKA,
  MP4,
  QTFF,
  WEBM,
} from "mediabunny"
import { ensureMediabunnyCodecs } from "./register-codecs"
import { previewFrameTime } from "./stream-thumbnail"
import {
  PROBE_METADATA_TIMEOUT_MS,
  PROBE_THUMBNAIL_TIMEOUT_MS,
  type ProbeMediaResult,
} from "./upload-pipeline.types"

export class ProbeTimeoutError extends Error {
  constructor() {
    super("Reading the video took too long")
    this.name = "ProbeTimeoutError"
  }
}

/**
 * Settles with `promise`, or with `onTimeout()` (its value, or its thrown
 * error) once `ms` have passed.
 */
export function withTimeout<T, F = never>(
  promise: Promise<T>,
  ms: number,
  onTimeout: () => F
): Promise<T | F> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<F>((resolve, reject) => {
    timer = setTimeout(() => {
      try {
        resolve(onTimeout())
      } catch (error) {
        reject(error)
      }
    }, ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

const INPUT_FORMATS = [MP4, QTFF, WEBM, MATROSKA]

export async function probeMediaFile(file: File): Promise<ProbeMediaResult> {
  await ensureMediabunnyCodecs()

  const input = new Input({
    source: new BlobSource(file),
    formats: INPUT_FORMATS,
  })

  try {
    const { durationSeconds, videoTrack, audioTrack } = await withTimeout(
      (async () => ({
        durationSeconds: await input.computeDuration(),
        videoTrack: await input.getPrimaryVideoTrack(),
        audioTrack: await input.getPrimaryAudioTrack(),
      }))(),
      PROBE_METADATA_TIMEOUT_MS,
      () => {
        throw new ProbeTimeoutError()
      }
    )

    let width: number | null = null
    let height: number | null = null
    let thumbnailObjectUrl: string | null = null

    if (videoTrack) {
      width = await videoTrack.getDisplayWidth()
      height = await videoTrack.getDisplayHeight()

      // The thumbnail needs a decoded frame. Browsers that can't decode the
      // codec (often HEVC/H.265) throw here; the file can still be uploaded
      // as-is, so go without a preview.
      // Some decoders never settle, so this is also time-boxed.
      try {
        thumbnailObjectUrl = await withTimeout(
          (async () => {
            const sink = new CanvasSink(videoTrack, { poolSize: 1 })
            const wrapped =
              (await sink.getCanvas(previewFrameTime(durationSeconds))) ??
              (await sink.getCanvas(0))
            const canvas = wrapped?.canvas
            if (!(canvas instanceof HTMLCanvasElement)) return null
            return new Promise<string | null>((resolve) => {
              canvas.toBlob(
                (blob) => resolve(blob ? URL.createObjectURL(blob) : null),
                "image/jpeg",
                0.85
              )
            })
          })(),
          PROBE_THUMBNAIL_TIMEOUT_MS,
          () => null
        )
      } catch {
        thumbnailObjectUrl = null
      }
    }

    return {
      durationSeconds: Number.isFinite(durationSeconds)
        ? durationSeconds
        : null,
      width,
      height,
      hasVideo: videoTrack != null,
      hasAudio: audioTrack != null,
      thumbnailObjectUrl,
    }
  } finally {
    input.dispose()
  }
}
