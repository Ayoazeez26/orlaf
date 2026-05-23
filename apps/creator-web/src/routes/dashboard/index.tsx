import { createFileRoute } from "@tanstack/react-router"
import { HomePage } from "@/features/dashboard/components/home/home-page"

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
})

function Dashboard() {
  return <HomePage />
}
