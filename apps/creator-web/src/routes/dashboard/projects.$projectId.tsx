import { createFileRoute } from "@tanstack/react-router"
import { ProjectDetailLayout } from "@/features/projects/components/detail/project-detail-layout"

export const Route = createFileRoute("/dashboard/projects/$projectId")({
  component: ProjectDetailLayout,
})
