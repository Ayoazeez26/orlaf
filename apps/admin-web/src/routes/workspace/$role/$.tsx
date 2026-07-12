import { createFileRoute } from "@tanstack/react-router"
import { WorkspaceStubPage } from "@/features/workspaces/components/workspace-stub-page"
import { getWorkspace } from "@/features/workspaces/data/roles"
import {
  getNavSectionLabel,
  roleHasNavAccess,
} from "@/features/workspaces/lib/nav-access"
import type { WorkspaceRoleId } from "@/features/workspaces/types"

export const Route = createFileRoute("/workspace/$role/$")({
  component: WorkspaceSection,
})

function WorkspaceSection() {
  const { role, _splat } = Route.useParams()
  const workspaceRole = role as WorkspaceRoleId
  const section = _splat ?? ""
  const config = getWorkspace(role)
  const label = getNavSectionLabel(section)

  if (!roleHasNavAccess(workspaceRole, section)) {
    return (
      <WorkspaceStubPage
        title={label}
        description={`The ${label} section is not available in the ${config?.name ?? "admin"} workspace.`}
      />
    )
  }

  return (
    <WorkspaceStubPage
      title={label}
      description={`The ${label} section is part of the ${config?.name ?? "admin"} demo and is coming soon.`}
    />
  )
}
