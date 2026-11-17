import { BlobSource, Input, MP4, QTFF } from "mediabunny"
import type {
  WorkerConvertRequest,
  WorkerOutMessage,
} from "./conversion.worker"
import { withTimeout } from "./probe-media"
import { toMp4FileName } from "./upload-file-name"
import {
  type ConvertForUploadOptions,
  type ConvertForUploadResult,
  MAX_IN_BROWSER_CONVERT_BYTES,
  PROBE_METADATA_TIMEOUT_MS,
} from "./upload-pipeline.types"

/** Containers Cloudflare Stream ingests directly and transcodes itself. */
const STREAM_INGESTIBLE_TYPES = new Set(["video/mp4", "video/quicktime"])

/**
 * Codecs Cloudflare Stream accepts as-is. Phones record H.264 or HEVC with
 * AAC, so most uploads skip the slow in-browser re-encode entirely.
 */
const PASSTHROUGH_VIDEO_CODECS = new Set(["avc", "hevc"])
const PASSTHROUGH_AUDIO_CODECS = new Set(["aac", "mp3"])

/** How far from 9:16 a video may be and still count as vertical. */
const VERTICAL_RATIO_TOLERANCE = 0.02

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError"
}

function abortError() {
  return new DOMException("Conversion aborted", "AbortError")
}

interface OriginalInfo {
  durationSeconds: number | null
  width: number | null
  height: number | null
  videoCodec: string | null
  audioCodec: string | null
}

async function readOriginal(file: File): Promise<OriginalInfo | null> {
  const input = new Input({
    source: new BlobSource(file),
    formats: [MP4, QTFF],
  })
  try {
    // Unknown (null) when reading takes too long; the caller then uploads
    // large files as they are instead of waiting.
    return await withTimeout(
      (async (): Promise<OriginalInfo> => {
        const duration = await input.computeDuration()
        const videoTrack = await input.getPrimaryVideoTrack()
        const audioTrack = await input.getPrimaryAudioTrack()
        return {
          durationSeconds: Number.isFinite(duration) ? duration : null,
          width: videoTrack ? await videoTrack.getDisplayWidth() : null,
          height: videoTrack ? await videoTrack.getDisplayHeight() : null,
          videoCodec: videoTrack ? await videoTrack.getCodec() : null,
          audioCodec: audioTrack ? await audioTrack.getCodec() : null,
        }
      })(),
      PROBE_METADATA_TIMEOUT_MS,
      () => null
    )
  } catch {
    return null
  } finally {
    input.dispose()
  }
}

function isVertical(width: number | null, height: number | null) {
  if (!width || !height) return false
  return Math.abs(width / height - 9 / 16) <= VERTICAL_RATIO_TOLERANCE
}

/** True when Cloudflare can take the original file without a re-encode. */
export function canUploadOriginal(
  info: OriginalInfo,
  aiVerticalConversion: boolean
): boolean {
  if (!info.videoCodec || !PASSTHROUGH_VIDEO_CODECS.has(info.videoCodec)) {
    return false
  }
  if (info.audioCodec && !PASSTHROUGH_AUDIO_CODECS.has(info.audioCodec)) {
    return false
  }
  // AI vertical conversion crops to 9:16 here, so only skip it when the
  // video already is 9:16.
  if (aiVerticalConversion && !isVertical(info.width, info.height)) {
    return false
  }
  return true
}

function originalResult(
  file: File,
  info: Pick<OriginalInfo, "durationSeconds" | "width" | "height"> | null
): ConvertForUploadResult {
  return {
    blob: file,
    fileName: file.name,
    converted: false,
    durationSeconds: info?.durationSeconds ?? null,
    width: info?.width ?? null,
    height: info?.height ?? null,
  }
}

/**
 * Prepares a video for upload. Files Cloudflare Stream can ingest as-is are
 * uploaded untouched — it transcodes server-side anyway, and re-encoding in
 * the browser is the slowest part of an upload. Other files are converted in
 * a worker.
 *
 * Some WebKit builds (iOS Safari, and Chrome on iOS which uses WebKit)
 * advertise a WebCodecs VideoEncoder that then fails mid-encode ("Encoding
 * task did not complete"). When that happens and the source is already an
 * MP4/MOV, the original is uploaded instead.
 */
export async function convertForUpload(
  file: File,
  options: ConvertForUploadOptions
): Promise<ConvertForUploadResult> {
  const ingestible = STREAM_INGESTIBLE_TYPES.has(file.type)
  const info = ingestible ? await readOriginal(file) : null
  if (options.signal?.aborted) throw abortError()

  if (info && !info.videoCodec) {
    // An audio file in an MP4/MOV wrapper; Cloudflare would reject it.
    throw new Error("This file has no video track. Choose a video file.")
  }

  if (info && canUploadOriginal(info, options.aiVerticalConversion)) {
    options.onProgress?.({ phase: "converting", value: 1 })
    return originalResult(file, info)
  }

  // Converting holds the whole output in memory, which can crash the tab for
  // very large files. Cloudflare transcodes MP4/MOV itself, so send those
  // as they are.
  if (file.size > MAX_IN_BROWSER_CONVERT_BYTES) {
    if (!ingestible) {
      throw new Error(
        "This file is too large to convert in the browser. Export it as MP4 or MOV and try again."
      )
    }
    options.onProgress?.({ phase: "converting", value: 1 })
    return originalResult(file, info)
  }

  try {
    return await convertInWorker(file, options)
  } catch (error) {
    if (
      isAbortError(error) ||
      !ingestible ||
      (error instanceof Error && error.message.includes("no video track"))
    ) {
      throw error
    }
    console.warn(
      "[convertForUpload] In-browser conversion failed; uploading the original file",
      error
    )
    options.onProgress?.({ phase: "converting", value: 1 })
    return originalResult(file, info)
  }
}

/**
 * Runs one conversion in its own worker. A worker per conversion keeps two
 * concurrent conversions from reading each other's messages, and terminating
 * it on abort actually stops the encode and frees its memory.
 */
function convertInWorker(
  file: File,
  options: ConvertForUploadOptions
): Promise<ConvertForUploadResult> {
  const { aiVerticalConversion, onProgress, signal } = options

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError())
      return
    }

    const worker = new Worker(
      new URL("./conversion.worker.ts", import.meta.url),
      { type: "module" }
    )

    const finish = () => {
      signal?.removeEventListener("abort", onAbort)
      worker.terminate()
    }

    const onAbort = () => {
      finish()
      reject(abortError())
    }

    signal?.addEventListener("abort", onAbort)

    worker.addEventListener("error", (event) => {
      finish()
      reject(new Error(event.message || "Conversion worker crashed"))
    })

    worker.addEventListener(
      "message",
      (event: MessageEvent<WorkerOutMessage>) => {
        const data = event.data

        if (data.type === "progress") {
          onProgress?.({ phase: "converting", value: data.value })
          return
        }

        if (data.type === "error") {
          finish()
          reject(new Error(data.message))
          return
        }

        if (data.type === "done") {
          finish()
          resolve({
            blob: new Blob([data.buffer], { type: "video/mp4" }),
            fileName: toMp4FileName(file.name),
            converted: true,
            durationSeconds: data.durationSeconds,
            width: data.width,
            height: data.height,
          })
        }
      }
    )

    onProgress?.({ phase: "converting", value: 0 })

    // A File is passed by reference, so the worker reads it from disk instead
    // of holding a second in-memory copy of the whole video.
    const request: WorkerConvertRequest = {
      type: "convert",
      file,
      aiVerticalConversion,
    }
    worker.postMessage(request)
  })
}
