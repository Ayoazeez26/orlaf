import { createFileRoute, redirect } from "@tanstack/react-router"
import { getAuthReady } from "@/features/auth/lib/auth-bootstrap"
import { resolvePostSignInRoute } from "@/features/auth/lib/post-sign-in-route"

export const Route = createFileRoute("/")({
  ssr: false,
  beforeLoad: async () => {
    const { status, session } = await getAuthReady()

    if (status === "loading") return

    if (status !== "authenticated" || !session) {
      throw redirect({ to: "/login" })
    }

    const destination = resolvePostSignInRoute(session)
    if (destination.params) {
      throw redirect({ to: destination.to, params: destination.params })
    }
    throw redirect({ to: destination.to })
  },
})
