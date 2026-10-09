import { createFileRoute, redirect } from "@tanstack/react-router"
import { getAuthReady } from "@/features/auth/lib/auth-bootstrap"
import { resolvePostSignInRoute } from "@/features/auth/lib/post-sign-in-route"

export const Route = createFileRoute("/")({
  ssr: false,
  beforeLoad: async () => {
    const { status, session } = await getAuthReady()
    if (status === "loading" || !session) {
      throw redirect({ to: "/login" })
    }

    const destination = resolvePostSignInRoute(session)
    if (destination.to === "/onboarding") {
      throw redirect({ to: destination.to, search: destination.search })
    }
    throw redirect({ to: destination.to })
  },
})
