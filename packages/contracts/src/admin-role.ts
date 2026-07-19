import { AdminRole } from "./auth.js"

/** URL segment used in admin-web workspace routing (`/workspace/$role`). */
export const ADMIN_WORKSPACE_ROLE_IDS = [
  "super-admin",
  "content-admin",
  "marketing-admin",
  "finance-admin",
  "support-admin",
] as const

export type AdminWorkspaceRoleId = (typeof ADMIN_WORKSPACE_ROLE_IDS)[number]

const ROLE_TO_WORKSPACE: Record<AdminRole, AdminWorkspaceRoleId> = {
  [AdminRole.SUPER_ADMIN]: "super-admin",
  [AdminRole.CONTENT_ADMIN]: "content-admin",
  [AdminRole.MARKETING_ADMIN]: "marketing-admin",
  [AdminRole.FINANCE_ADMIN]: "finance-admin",
  [AdminRole.SUPPORT_ADMIN]: "support-admin",
}

const WORKSPACE_TO_ROLE: Record<AdminWorkspaceRoleId, AdminRole> = {
  "super-admin": AdminRole.SUPER_ADMIN,
  "content-admin": AdminRole.CONTENT_ADMIN,
  "marketing-admin": AdminRole.MARKETING_ADMIN,
  "finance-admin": AdminRole.FINANCE_ADMIN,
  "support-admin": AdminRole.SUPPORT_ADMIN,
}

export function isAdminWorkspaceRoleId(
  value: string
): value is AdminWorkspaceRoleId {
  return (ADMIN_WORKSPACE_ROLE_IDS as readonly string[]).includes(value)
}

export function adminRoleToWorkspaceId(role: AdminRole): AdminWorkspaceRoleId {
  return ROLE_TO_WORKSPACE[role]
}

export function workspaceIdToAdminRole(id: AdminWorkspaceRoleId): AdminRole {
  return WORKSPACE_TO_ROLE[id]
}
