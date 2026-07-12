import type { ReactNode } from "react"
import { getWorkspace } from "../data/roles"
import { getNavSectionLabel, roleHasNavAccess } from "../lib/nav-access"
import type { WorkspaceRoleId } from "../types"
import { WorkspaceStubPage } from "./workspace-stub-page"

interface WorkspaceSectionGateProps {
  role: WorkspaceRoleId
  sectionKey: string
  children: ReactNode
}

export function WorkspaceSectionGate({
  role,
  sectionKey,
  children,
}: WorkspaceSectionGateProps) {
  if (!roleHasNavAccess(role, sectionKey)) {
    const config = getWorkspace(role)
    const label = getNavSectionLabel(sectionKey)

    return (
      <WorkspaceStubPage
        title={label}
        description={`The ${label} section is not available in the ${config?.name ?? "admin"} workspace.`}
      />
    )
  }

  return children
}
