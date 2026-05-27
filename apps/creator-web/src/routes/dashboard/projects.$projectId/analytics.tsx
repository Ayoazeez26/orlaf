import { createFileRoute } from "@tanstack/react-router"
import { ProjectAnalyticsTab } from "@/features/projects/components/tabs/project-analytics-tab"

export const Route = createFileRoute(
  "/dashboard/projects/$projectId/analytics"
)({
  component: ProjectAnalyticsTab,
})
