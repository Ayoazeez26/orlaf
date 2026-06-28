import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/pending-approval")({
  ssr: false,
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" })
  },
})
