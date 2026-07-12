import { BarChart3, Bell, LifeBuoy, Settings } from "lucide-react"
import type { NavItem, WorkspaceUser } from "../types"

/** The demo operates as a single signed-in admin across every workspace. */
export const DEMO_USER: WorkspaceUser = {
  fullName: "Ada Obi",
  initials: "AO",
  email: "ada@sable.tv",
}

export const OPERATIONS_ITEMS: NavItem[] = [
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "support", label: "Support", icon: LifeBuoy },
  { key: "settings", label: "Settings", icon: Settings },
]

export const ANALYTICS_ITEM: NavItem = {
  key: "analytics",
  label: "Analytics",
  icon: BarChart3,
}
