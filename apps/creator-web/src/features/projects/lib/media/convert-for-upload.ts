import type {
  WorkerConvertRequest,
  WorkerOutMessage,
} from "./conversion.worker"
import { toMp4FileName } from "./upload-file-name"
import type {
  ConvertForUploadOptions,
  ConvertForUploadResult,
} from "./upload-pipeline.types"

let worker: Worker | null = null

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL("./conversion.worker.ts", import.meta.url), {
      type: "module",
    })
  }
  return worker
}

export function convertForUpload(
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
