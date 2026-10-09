let currentProgress = 0
const listeners = new Set<(progress: number) => void>()

export function getAuthBootstrapProgress() {
  return currentProgress
}

export function setAuthBootstrapProgress(progress: number) {
  currentProgress = Math.min(100, Math.max(0, Math.round(progress)))
  listeners.forEach((listener) => {
    listener(currentProgress)
  })
}

export function resetAuthBootstrapProgress() {
  currentProgress = 0
  listeners.forEach((listener) => {
    listener(0)
  })
}

export function subscribeAuthBootstrapProgress(
  listener: (progress: number) => void
) {
  listeners.add(listener)
  listener(currentProgress)
  return () => listeners.delete(listener)
}
