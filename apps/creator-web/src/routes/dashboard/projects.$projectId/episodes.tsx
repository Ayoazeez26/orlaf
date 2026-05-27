import { createFileRoute } from "@tanstack/react-router"
import { ProjectEpisodesTab } from "@/features/projects/components/tabs/project-episodes-tab"

export const Route = createFileRoute("/dashboard/projects/$projectId/episodes")(
  {
    component: ProjectEpisodesTab,
  }
)
