import {
  BarChart3,
  Bell,
  CloudUpload,
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
    items: [
      { label: "Home", to: "/dashboard", icon: Home },
      { label: "Projects", to: "/dashboard/projects", icon: FolderKanban },
      { label: "Uploads", to: "/dashboard/uploads", icon: CloudUpload },
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
