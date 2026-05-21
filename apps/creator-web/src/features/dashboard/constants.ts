import {
  BarChart3,
  Crown,
  DollarSign,
  FolderKanban,
  Gift,
  Home,
  Lock,
  Settings,
} from "lucide-react"
import type { DashboardNavItem } from "./types"

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { label: "Home", to: "/dashboard", icon: Home },
  { label: "Projects", to: "/dashboard/projects", icon: FolderKanban },
  { label: "Analytics", to: "/dashboard/analytics", icon: BarChart3 },
  { label: "Revenue", to: "/dashboard/revenue", icon: DollarSign },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
]

export const MOCK_WORKSPACES = [
  {
    id: "lucid",
    name: "Lucid Productions",
    initials: "LP",
    role: "Owner" as const,
  },
  {
    id: "nova",
    name: "Nova Studios",
    initials: "NS",
    role: "Member" as const,
  },
]

export const EARN_MORE_ICON_MAP = {
  memberships: { icon: Crown, className: "text-primary" },
  extras: { icon: Gift, className: "text-pink-500" },
  locked: { icon: Lock, className: "text-primary" },
} as const
