import { WORKSPACE_ROLES } from "../data/roles"
import type { WorkspaceRoleId } from "../types"

export function getRoleNavKeys(role: WorkspaceRoleId): string[] {
  const workspace = WORKSPACE_ROLES[role]
  return workspace.navGroups.flatMap((group) =>
    group.items.map((item) => item.key)
  )
}

export function roleHasNavAccess(
  role: WorkspaceRoleId,
  sectionKey: string
): boolean {
  return getRoleNavKeys(role).includes(sectionKey)
}

export function getNavSectionLabel(sectionKey: string): string {
  for (const workspace of Object.values(WORKSPACE_ROLES)) {
    for (const group of workspace.navGroups) {
      const item = group.items.find((entry) => entry.key === sectionKey)
      if (item) return item.label
    }
  }

  return sectionKey
}
