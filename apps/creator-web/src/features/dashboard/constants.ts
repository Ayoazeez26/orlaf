import {
  BarChart3,
  Bell,
  DollarSign,
  FolderKanban,
  Home,
  LifeBuoy,
  Megaphone,
  Settings,
} from "lucide-react"
import type { DashboardNavGroup } from "./types"

export const DASHBOARD_NAV_GROUPS: DashboardNavGroup[] = [
  {
    label: "Studio",
    items: [
      { label: "Home", to: "/dashboard", icon: Home },
      { label: "Projects", to: "/dashboard/projects", icon: FolderKanban },
      { label: "Analytics", to: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Monetization",
    items: [
      { label: "Revenue", to: "/dashboard/revenue", icon: DollarSign },
      { label: "Promotions", to: "/dashboard/promotions", icon: Megaphone },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "Notifications",
        to: "/dashboard/notifications",
        icon: Bell,
      },
      { label: "Support", to: "/dashboard/support", icon: LifeBuoy },
      { label: "Settings", to: "/dashboard/settings", icon: Settings },
    ],
  },
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
