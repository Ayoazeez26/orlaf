import type { WorkspaceRoleId } from "../types"

/** Nav keys with dedicated file routes (not the splat stub). */
export const DEDICATED_NAV_ROUTES = {
  analytics: "/workspace/$role/analytics",
  streamers: "/workspace/$role/streamers",
  creators: "/workspace/$role/creators",
  onboarding: "/workspace/$role/onboarding",
  projects: "/workspace/$role/projects",
  discovery: "/workspace/$role/discovery",
  moderation: "/workspace/$role/moderation",
  payouts: "/workspace/$role/payouts",
  "coin-economy": "/workspace/$role/coin-economy",
  "revenue-split": "/workspace/$role/revenue-split",
  subscriptions: "/workspace/$role/subscriptions",
  promotions: "/workspace/$role/promotions",
  notifications: "/workspace/$role/notifications",
  "audit-log": "/workspace/$role/audit-log",
  support: "/workspace/$role/support",
} as const

export type DedicatedNavKey = keyof typeof DEDICATED_NAV_ROUTES

export function isDedicatedNavKey(key: string): key is DedicatedNavKey {
  return key in DEDICATED_NAV_ROUTES
}

export function getNavHref(role: WorkspaceRoleId, key: string) {
  if (key === "home") return `/workspace/${role}`
  return `/workspace/${role}/${key}`
}

export function getNavLinkTarget(key: string) {
  if (key === "home") {
    return {
      to: "/workspace/$role" as const,
      params: (role: WorkspaceRoleId) => ({ role }),
    }
  }

  if (isDedicatedNavKey(key)) {
    return {
      to: DEDICATED_NAV_ROUTES[key],
      params: (role: WorkspaceRoleId) => ({ role }),
    }
  }

  return {
    to: "/workspace/$role/$" as const,
    params: (role: WorkspaceRoleId) => ({ role, _splat: key }),
  }
}
