import type { AdminSignInResponse } from "@sable/contracts"
import { BarChart3, Bell, LifeBuoy, Settings } from "lucide-react"
import type { NavItem, WorkspaceUser } from "../types"

/** @deprecated Demo placeholder — use adminSessionToWorkspaceUser with real session. */
export const DEMO_USER: WorkspaceUser = {
  fullName: "Ada Obi",
  initials: "AO",
  email: "ada@sable.tv",
}

export function adminSessionToWorkspaceUser(
  admin: AdminSignInResponse["admin"]
): WorkspaceUser {
  const display =
    admin.display_name?.trim() || admin.email.split("@")[0] || "Admin"
  const parts = display.split(/\s+/).filter(Boolean)
  const initials =
    parts.length >= 2
      ? `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
      : display.slice(0, 2).toUpperCase()

  return {
    fullName: admin.display_name ?? display,
    initials: initials || "AD",
    email: admin.email,
  }
}

export const ANALYTICS_ITEM: NavItem = {
  key: "analytics",
  label: "Analytics",
  icon: BarChart3,
}

export const OPERATIONS_ITEMS: NavItem[] = [
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "support", label: "Support", icon: LifeBuoy },
  { key: "settings", label: "Settings", icon: Settings },
]
