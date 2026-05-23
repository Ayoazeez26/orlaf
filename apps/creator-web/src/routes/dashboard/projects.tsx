import { createFileRoute } from "@tanstack/react-router"
import { DashboardStubPage } from "@/features/dashboard/components/dashboard-stub-page"

export const Route = createFileRoute("/dashboard/projects")({
  component: DashboardProject,
})

function DashboardProject() {
  return <DashboardStubPage title="Projects" />
}
