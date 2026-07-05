const MAX_CONCURRENT_EPISODE_UPLOADS = 2

let activeUploads = 0
const uploadWaitQueue: Array<() => void> = []

export async function withEpisodeUploadSlot<T>(
  fn: () => Promise<T>
): Promise<T> {
  if (activeUploads >= MAX_CONCURRENT_EPISODE_UPLOADS) {
    await new Promise<void>((resolve) => {
      uploadWaitQueue.push(resolve)
    })
  }

  activeUploads += 1
  try {
    return await fn()
  } finally {
    activeUploads -= 1
    uploadWaitQueue.shift()?.()
  }
}

export function isUploadUrlExpiredError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  return /expir/i.test(message) && /upload/i.test(message)
}
