import { createFileRoute } from "@tanstack/react-router"
import { ProjectSettingsTab } from "@/features/projects/components/tabs/project-settings-tab"

export const Route = createFileRoute("/dashboard/projects/$projectId/settings")(
  {
    component: ProjectSettingsTab,
  }
)
