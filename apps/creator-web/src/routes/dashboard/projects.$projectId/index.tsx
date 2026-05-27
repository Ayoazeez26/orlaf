import { createFileRoute } from "@tanstack/react-router"
import { ProjectOverviewTab } from "@/features/projects/components/tabs/project-overview-tab"

export const Route = createFileRoute("/dashboard/projects/$projectId/")({
  component: ProjectOverviewTab,
})
