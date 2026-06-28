/**
 * Studio upload service — direct uploads to R2 and Cloudflare Stream.
 * Files never pass through the backend; only signed URLs are minted via studio-api.
 */

import type {
  ImageUploadUrlResponse,
  UploadUrlResponse,
} from "@sable/contracts"
import { toMp4FileName } from "../lib/media/upload-file-name"
import {
  getEpisodeUploadUrl,
  getImageUploadUrl,
  getSeriesImageUploadUrl,
  getSeriesTrailerUploadUrl,
  getTrailerStatus,
  getWizardTrailerUploadUrl,
} from "./studio-api"

export type UploadProgressCallback = (progress: number) => void

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
] as const

export function assertImageType(file: File): void {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
    )
  ) {
    throw new Error(
      `Invalid file type: ${file.type || "unknown"}. Must be JPG, PNG, or WebP.`
    )
  }
}

export function assertVideoType(file: File): void {
  if (
    !ALLOWED_VIDEO_TYPES.includes(
      file.type as (typeof ALLOWED_VIDEO_TYPES)[number]
    )
  ) {
    throw new Error(
      `Invalid file type: ${file.type || "unknown"}. Must be MP4 or MOV.`
    )
  }
}

export function uploadWithPut(
  uploadUrl: string,
  body: Blob | File,
  contentType: string,
  onProgress?: UploadProgressCallback
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(event.loaded / event.total)
      }
    })

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    })

    xhr.addEventListener("error", () =>
      reject(new Error("Network error during upload"))
    )
    xhr.addEventListener("abort", () => reject(new Error("Upload aborted")))

    xhr.open("PUT", uploadUrl)
    xhr.setRequestHeader("Content-Type", contentType)
    xhr.send(body)
  })
}

/** Cloudflare Stream direct upload expects POST multipart/form-data. */
export function uploadToCloudflareStream(
  uploadUrl: string,
  file: Blob | File,
  onProgress?: UploadProgressCallback,
  fileName?: string
): Promise<void> {
  const resolvedName =
    fileName ?? (file instanceof File ? file.name : undefined) ?? "video.mp4"
  const uploadName = toMp4FileName(resolvedName)
  const formData = new FormData()
  formData.append("file", file, uploadName)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", uploadUrl)

    let lastReported = 0
    const reportProgress = (value: number) => {
      const clamped = Math.min(Math.max(value, 0), 0.99)
      if (clamped > lastReported) {
        lastReported = clamped
        onProgress?.(clamped)
      }
    }

    // Cloudflare multipart uploads often omit Content-Length; progress stays at 0
    // unless we synthesize movement while bytes are flowing.
    const heartbeat = window.setInterval(() => {
      if (lastReported < 0.9) {
        reportProgress(lastReported + 0.02)
      }
    }, 2000)

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && event.total > 0) {
        reportProgress(event.loaded / event.total)
      } else if (event.loaded > 0 && file.size > 0) {
        reportProgress(event.loaded / file.size)
      }
    })

    xhr.addEventListener("load", () => {
      window.clearInterval(heartbeat)
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(1)
        resolve()
      } else {
        reject(
          new Error(
            `Upload failed with status ${xhr.status}${xhr.responseText ? `: ${xhr.responseText.slice(0, 200)}` : ""}`
          )
        )
      }
    })

    xhr.addEventListener("error", () => {
      window.clearInterval(heartbeat)
      reject(new Error("Network error during upload"))
    })
    xhr.addEventListener("abort", () => {
      window.clearInterval(heartbeat)
      reject(new Error("Upload aborted"))
    })

    xhr.send(formData)
  })
}

export async function uploadPoster(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<{ imageUrl: string }> {
  assertImageType(file)

  const { uploadUrl, imageUrl }: ImageUploadUrlResponse =
    await getImageUploadUrl(file.type)

  await uploadWithPut(uploadUrl, file, file.type, onProgress)

  return { imageUrl }
}

export async function uploadWizardTrailer(
  file: Blob | File,
  contentType: string,
  onProgress?: UploadProgressCallback,
  fileName?: string
): Promise<{ videoId: string }> {
  const { uploadUrl, videoId }: UploadUrlResponse =
    await getWizardTrailerUploadUrl(contentType)

  await uploadToCloudflareStream(uploadUrl, file, onProgress, fileName)

  return { videoId }
}

export async function uploadSeriesPoster(
  seriesId: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<{ imageUrl: string }> {
  assertImageType(file)

  const { uploadUrl, imageUrl }: ImageUploadUrlResponse =
    await getSeriesImageUploadUrl(seriesId, file.type)

  await uploadWithPut(uploadUrl, file, file.type, onProgress)

  return { imageUrl }
}

export async function uploadSeriesTrailer(
  seriesId: string,
  file: Blob | File,
  onProgress?: UploadProgressCallback,
  fileName?: string
): Promise<{ videoId: string }> {
  const { uploadUrl, videoId }: UploadUrlResponse =
    await getSeriesTrailerUploadUrl(seriesId)

  await uploadToCloudflareStream(uploadUrl, file, onProgress, fileName)

  return { videoId }
}

export async function uploadEpisodeVideo(
  seriesId: string,
  episodeId: string,
  file: Blob | File,
  onProgress?: UploadProgressCallback,
  fileName?: string
): Promise<{ videoId: string }> {
  const { uploadUrl, videoId } = await getEpisodeUploadUrl(seriesId, episodeId)

  await uploadToCloudflareStream(uploadUrl, file, onProgress, fileName)

  return { videoId }
}

export async function waitForTrailerReady(
  videoId: string,
  options: { intervalMs?: number; timeoutMs?: number } = {}
): Promise<string> {
  const { intervalMs = 3000, timeoutMs = 120_000 } = options
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    const data = await getTrailerStatus(videoId)

    if (data.status === "failed") {
      throw new Error("Trailer processing failed")
    }

    if (data.status === "ready" && data.hlsUrl) {
      return data.hlsUrl
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }

  throw new Error("Trailer processing timed out")
}
