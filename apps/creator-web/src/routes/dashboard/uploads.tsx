import { createFileRoute } from "@tanstack/react-router"
import { UploadsPage } from "@/features/uploads/pages/uploads-page"

export const Route = createFileRoute("/dashboard/uploads")({
  component: UploadsPage,
})
