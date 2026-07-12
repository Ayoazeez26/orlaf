import { useEffect, useState } from "react"

interface UseSimulatedProgressOptions {
  /** When false, progress freezes at its last value. */
  active?: boolean
  /** Progress never exceeds this while active (jumps to 100 when completed). */
  cap?: number
  /** Snap to 100 when the underlying work finishes. */
  completed?: boolean
}

/**
 * Asymptotic progress for requests where byte-level progress is unavailable.
 * Most JSON API calls fall into this bucket — use milestone progress when you
 * control discrete steps (see auth-bootstrap-progress).
 */
export function useSimulatedProgress({
  active = true,
  cap = 92,
  completed = false,
}: UseSimulatedProgressOptions = {}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!active) return

    let value = 0
    const interval = window.setInterval(() => {
      const headroom = cap - value
      if (headroom <= 0) return

      const pace = value < 25 ? 6 : value < 55 ? 3.5 : value < 80 ? 1.5 : 0.6
      value = Math.min(cap, value + pace * (0.35 + Math.random() * 0.65))
      setProgress(Math.round(value))
    }, 160)

    return () => window.clearInterval(interval)
  }, [active, cap])

  useEffect(() => {
    if (completed) {
      setProgress(100)
    }
  }, [completed])

  useEffect(() => {
    if (active) {
      setProgress(0)
    }
  }, [active])

  return progress
}
