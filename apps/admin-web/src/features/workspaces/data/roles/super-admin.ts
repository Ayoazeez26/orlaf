import {
  AlertTriangle,
  Banknote,
  Bell,
  CheckCircle2,
  Clock,
  CreditCard,
  Crown,
  Eye,
  FileText,
  FolderKanban,
  FolderOpen,
  Home,
  LifeBuoy,
  Link,
  Megaphone,
  MonitorPlay,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
  Split,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react"
import type { WorkspaceConfig } from "../../types"
import { ANALYTICS_ITEM, DEMO_USER } from "../shared"

export const SUPER_ADMIN: WorkspaceConfig = {
  id: "super-admin",
  name: "Super Admin",
  user: DEMO_USER,
  picker: {
    title: "Super Admin",
    description:
      "Full platform oversight across every workspace, role, and policy.",
    icon: Crown,
    tone: "primary",
  },
  navGroups: [
    {
      label: "Overview",
      items: [{ key: "home", label: "Home", icon: Home }, ANALYTICS_ITEM],
    },
    {
      label: "Users & Content",
      items: [
        { key: "streamers", label: "Streamers", icon: MonitorPlay },
        { key: "creators", label: "Creators", icon: Users },
        { key: "onboarding", label: "Onboarding", icon: UserPlus },
        { key: "projects", label: "Projects", icon: FolderKanban },
        { key: "discovery", label: "Discovery", icon: Sparkles },
        { key: "moderation", label: "Moderation", icon: ShieldCheck },
      ],
    },
    {
      label: "Monetization",
      items: [
        { key: "coin-economy", label: "Coin Economy", icon: Link },
        { key: "payouts", label: "Payouts", icon: Banknote },
        { key: "revenue-split", label: "Revenue Split", icon: Split },
        { key: "subscriptions", label: "Subscriptions", icon: CreditCard },
        { key: "promotions", label: "Promotions", icon: Megaphone },
      ],
    },
    {
      label: "Operations",
      items: [
        { key: "notifications", label: "Notifications", icon: Bell },
        { key: "audit-log", label: "Audit Log", icon: ScrollText },
        { key: "support", label: "Support", icon: LifeBuoy },
        { key: "settings", label: "Settings", icon: Settings },
      ],
    },
  ],
  home: {
    metrics: [
      { label: "Total Users", value: "2,487", icon: Users },
      { label: "Total Content", value: "1,204", icon: TrendingUp },
      { label: "Platform Views", value: "88.2M", icon: Eye },
      { label: "Active Creators", value: "342", icon: FolderOpen },
    ],
    primary: {
      title: "Recent Activity",
      actionLabel: "View All",
      items: [
        {
          id: "creator-signed-up",
          title: "New creator signed up",
          subtitle: "Sarah Chen",
          icon: UserPlus,
          tone: "primary",
          trailing: "2m ago",
        },
        {
          id: "content-flagged",
          title: "Content flagged for review",
          subtitle: "Episode: Dark Arts",
          icon: AlertTriangle,
          tone: "warning",
          trailing: "15m ago",
        },
        {
          id: "series-approved",
          title: "Series approved",
          subtitle: "The Next Chapter",
          icon: CheckCircle2,
          tone: "positive",
          trailing: "1h ago",
        },
        {
          id: "creator-verified",
          title: "Creator verified",
          subtitle: "Mark Johnson",
          icon: ShieldCheck,
          tone: "primary",
          trailing: "2h ago",
        },
        {
          id: "series-submitted",
          title: "New series submitted",
          subtitle: "Urban Tales",
          icon: FileText,
          tone: "warning",
          trailing: "3h ago",
        },
      ],
    },
    side: [
      {
        kind: "progress",
        title: "Content Status",
        rows: [
          { label: "Published", value: "892", percent: 90, tone: "positive" },
          {
            label: "Pending Review",
            value: "47",
            percent: 16,
            tone: "warning",
          },
          { label: "Flagged", value: "12", percent: 6, tone: "danger" },
        ],
      },
      {
        kind: "items",
        title: "Quick Actions",
        items: [
          {
            id: "pending-approvals",
            title: "Pending Approvals",
            subtitle: "12 awaiting",
            icon: Clock,
            tone: "primary",
          },
          {
            id: "flagged-content",
            title: "Flagged Content",
            subtitle: "5 to review",
            icon: AlertTriangle,
            tone: "danger",
          },
        ],
      },
    ],
  },
}
