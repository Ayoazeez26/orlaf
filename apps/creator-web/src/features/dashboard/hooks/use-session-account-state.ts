import { useEffect } from "react"
import { fetchAuthSession } from "@/features/auth/api/auth-api"
import { useAuth } from "@/features/auth/auth-context"
import { getRouter } from "@/router"

const POLL_MS = 30_000

/** Refresh account_state so the pending-approval banner clears after admin approval. */
export function useSessionAccountState() {
  const { session, updateSession, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return

    let cancelled = false

    async function refresh() {
      try {
        const metadata = await fetchAuthSession()
        if (cancelled) return
        updateSession(metadata)

        if (metadata.account_state === "suspended") {
          void getRouter().navigate({ to: "/auth/suspended", replace: true })
        } else if (metadata.account_state === "rejected") {
          void getRouter().navigate({ to: "/auth/rejected", replace: true })
        }
      } catch {
        // Keep the existing session if the poll fails.
      }
    }

    void refresh()
    const interval = window.setInterval(() => void refresh(), POLL_MS)
    const onFocus = () => void refresh()
    window.addEventListener("focus", onFocus)

    return () => {
      cancelled = true
      window.clearInterval(interval)
      window.removeEventListener("focus", onFocus)
    }
  }, [isAuthenticated, updateSession])

  return session
}
