import { BlobSource, Input, MP4, QTFF } from "mediabunny"
import type {
  WorkerConvertRequest,
  WorkerOutMessage,
} from "./conversion.worker"
import { toMp4FileName } from "./upload-file-name"
import type {
  ConvertForUploadOptions,
  ConvertForUploadResult,
} from "./upload-pipeline.types"

/** Containers Cloudflare Stream ingests directly and transcodes itself. */
const STREAM_INGESTIBLE_TYPES = new Set(["video/mp4", "video/quicktime"])

let worker: Worker | null = null

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL("./conversion.worker.ts", import.meta.url), {
      type: "module",
    })
  }
  return worker
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError"
}

async function readOriginalMetadata(
  file: File
): Promise<Omit<ConvertForUploadResult, "blob" | "fileName">> {
  const input = new Input({
    source: new BlobSource(file),
    formats: [MP4, QTFF],
  })
  try {
    const duration = await input.computeDuration()
    const videoTrack = await input.getPrimaryVideoTrack()
    return {
      durationSeconds: Number.isFinite(duration) ? duration : null,
      width: videoTrack ? await videoTrack.getDisplayWidth() : null,
      height: videoTrack ? await videoTrack.getDisplayHeight() : null,
    }
  } catch {
    return { durationSeconds: null, width: null, height: null }
  } finally {
    input.dispose()
  }
}

/**
 * Converts a video in the browser before upload. Some WebKit builds (iOS
 * Safari, and Chrome on iOS which uses WebKit) advertise a WebCodecs
 * VideoEncoder that then fails mid-encode ("Encoding task did not
 * complete"). When that happens and the source is already an MP4/MOV,
 * upload the original instead — Cloudflare Stream transcodes it server-side
 * and the player cover-fits non-vertical sources.
 */
export async function convertForUpload(
  file: File,
  options: ConvertForUploadOptions
): Promise<ConvertForUploadResult> {
  try {
    return await convertInWorker(file, options)
  } catch (error) {
    if (isAbortError(error) || !STREAM_INGESTIBLE_TYPES.has(file.type)) {
      throw error
    }
    console.warn(
      "[convertForUpload] In-browser conversion failed; uploading the original file",
      error
    )
    options.onProgress?.({ phase: "converting", value: 1 })
    return {
      blob: file,
      fileName: file.name,
      ...(await readOriginalMetadata(file)),
    }
  }
}

function convertInWorker(
  file: File,
  options: ConvertForUploadOptions
): Promise<ConvertForUploadResult> {
  const { aiVerticalConversion, onProgress, signal } = options

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Conversion aborted", "AbortError"))
      return
    }

    const w = getWorker()

    const onAbort = () => {
      cleanup()
      reject(new DOMException("Conversion aborted", "AbortError"))
    }

    signal?.addEventListener("abort", onAbort)

    const handleMessage = (event: MessageEvent<WorkerOutMessage>) => {
      const data = event.data

      if (data.type === "progress") {
        onProgress?.({ phase: "converting", value: data.value })
        return
      }

      if (data.type === "error") {
        cleanup()
        reject(new Error(data.message))
        return
      }

      if (data.type === "done") {
        cleanup()
        const blob = new Blob([data.buffer], { type: "video/mp4" })
        resolve({
          blob,
          fileName: toMp4FileName(file.name),
          durationSeconds: data.durationSeconds,
          width: data.width,
          height: data.height,
        })
      }
    }

    const cleanup = () => {
      w.removeEventListener("message", handleMessage)
      signal?.removeEventListener("abort", onAbort)
    }

    w.addEventListener("message", handleMessage)

    onProgress?.({ phase: "converting", value: 0 })

    file.arrayBuffer().then((fileBuffer) => {
      if (signal?.aborted) {
        cleanup()
        reject(new DOMException("Conversion aborted", "AbortError"))
        return
      }

      const request: WorkerConvertRequest = {
        type: "convert",
        fileBuffer,
        fileName: file.name,
        aiVerticalConversion,
      }

      w.postMessage(request, [fileBuffer])
    }, reject)
  })
}
