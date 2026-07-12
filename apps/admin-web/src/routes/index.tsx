import { createFileRoute } from "@tanstack/react-router"
import { RolePickerPage } from "@/features/workspaces/components/role-picker/role-picker-page"

export const Route = createFileRoute("/")({
  component: RolePickerPage,
})
