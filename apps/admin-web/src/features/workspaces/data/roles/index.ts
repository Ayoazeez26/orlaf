import type { WorkspaceConfig, WorkspaceRoleId } from "../../types"
import { CONTENT_ADMIN } from "./content-admin"
import { FINANCE_ADMIN } from "./finance-admin"
import { MARKETING_ADMIN } from "./marketing-admin"
import { SUPER_ADMIN } from "./super-admin"
import { SUPPORT_ADMIN } from "./support-admin"

export const WORKSPACE_ROLES: Record<WorkspaceRoleId, WorkspaceConfig> = {
  "super-admin": SUPER_ADMIN,
  "content-admin": CONTENT_ADMIN,
  "marketing-admin": MARKETING_ADMIN,
  "finance-admin": FINANCE_ADMIN,
  "support-admin": SUPPORT_ADMIN,
}

/** Order used on the Start Demo role picker. */
export const WORKSPACE_ROLE_ORDER: WorkspaceRoleId[] = [
  "super-admin",
  "content-admin",
  "marketing-admin",
  "finance-admin",
  "support-admin",
]

export const WORKSPACE_LIST: WorkspaceConfig[] = WORKSPACE_ROLE_ORDER.map(
  (id) => WORKSPACE_ROLES[id]
)

export function isWorkspaceRole(value: string): value is WorkspaceRoleId {
  return value in WORKSPACE_ROLES
}

export function getWorkspace(value: string): WorkspaceConfig | undefined {
  return isWorkspaceRole(value) ? WORKSPACE_ROLES[value] : undefined
}
