import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { getAuthReady } from "@/features/auth/lib/auth-bootstrap"
import { resolvePostSignInRoute } from "@/features/auth/lib/post-sign-in-route"

export const Route = createFileRoute("/forgot-password")({
  ssr: false,
  beforeLoad: async () => {
    const { status, session } = await getAuthReady()
    if (status === "loading" || status !== "authenticated" || !session) return

    const destination = resolvePostSignInRoute(session)
    if (destination.to === "/onboarding" && destination.search?.step) {
      throw redirect({ to: destination.to, search: destination.search })
    }
    throw redirect({ to: destination.to })
  },
  component: ForgotPasswordLayout,
})

function ForgotPasswordLayout() {
  return <Outlet />
}
