import { useEffect, useState } from "react"

export type TawkStatus = "loading" | "online" | "away" | "offline"

interface TawkApi {
  onLoad?: () => void
  onStatusChange?: (status: "online" | "away" | "offline") => void
  hideWidget?: () => void
  showWidget?: () => void
  toggle?: () => void
  maximize?: () => void
  minimize?: () => void
  getStatus?: () => "online" | "away" | "offline"
  setAttributes?: (
    attributes: Record<string, string>,
    callback?: (error: unknown) => void
  ) => void
}

declare global {
  interface Window {
    Tawk_API?: TawkApi
  }
}

export const TAWK_LOADED_EVENT = "tawk:loaded"
export const TAWK_STATUS_EVENT = "tawk:status"

function isTawkReady(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.Tawk_API?.getStatus === "function"
  )
}

/**
 * Caches the latest known status at module scope, updated by a listener
 * that's registered once the module loads — not tied to any component's
 * mount lifecycle. The bootstrap script's Tawk_API.onStatusChange (see
 * __root.tsx) can dispatch "tawk:status" before any React tree that cares
 * about it has mounted (e.g. the user hasn't opened the Live Chat tab yet);
 * without this cache, a hook mounting later would miss that one-time event
 * and fall back to Tawk_API.getStatus()'s pre-sync default ("online").
 */
let lastKnownStatus: TawkStatus = "loading"

if (typeof window !== "undefined") {
  window.addEventListener(TAWK_STATUS_EVENT, (event) => {
    const detail = (event as CustomEvent<"online" | "away" | "offline">).detail
    if (detail) lastKnownStatus = detail
  })
}

/**
 * Only an agent actively online guarantees a real-time reply.
 *
 * `Tawk_API.getStatus()` is a live getter, not a one-time snapshot — it's
 * re-read on every mount so a status change made while this panel wasn't on
 * screen (e.g. an agent going away between visits, in the same page load) is
 * picked up immediately instead of trusting a stale cached value forever.
 * The cached `lastKnownStatus` is only used for the very first paint, to
 * avoid a loading flash when the real status is already known.
 */
export function useTawkStatus(): TawkStatus {
  const [status, setStatus] = useState<TawkStatus>(lastKnownStatus)

  useEffect(() => {
    function sync() {
      if (!isTawkReady() || !window.Tawk_API) return
      const current = window.Tawk_API.getStatus?.()
      if (current) setStatus(current)
    }

    function onStatus(event: Event) {
      const detail = (event as CustomEvent<"online" | "away" | "offline">)
        .detail
      if (detail) setStatus(detail)
    }

    sync()
    window.addEventListener(TAWK_LOADED_EVENT, sync)
    window.addEventListener(TAWK_STATUS_EVENT, onStatus)
    return () => {
      window.removeEventListener(TAWK_LOADED_EVENT, sync)
      window.removeEventListener(TAWK_STATUS_EVENT, onStatus)
    }
  }, [])

  return status
}

export function openTawkChat() {
  window.Tawk_API?.maximize?.()
}

export function identifyTawkVisitor(attributes: Record<string, string>) {
  if (!isTawkReady()) return
  window.Tawk_API?.setAttributes?.(attributes, () => {})
}
