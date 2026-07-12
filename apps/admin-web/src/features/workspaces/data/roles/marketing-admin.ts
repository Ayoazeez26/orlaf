import {
  Clock,
  CreditCard,
  FolderKanban,
  Home,
  Megaphone,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react"
import type { WorkspaceConfig } from "../../types"
import { ANALYTICS_ITEM, DEMO_USER, OPERATIONS_ITEMS } from "../shared"

export const MARKETING_ADMIN: WorkspaceConfig = {
  id: "marketing-admin",
  name: "Marketing Admin",
  user: DEMO_USER,
  picker: {
    title: "Marketing / Promotions Admin",
    description:
      "Run promotions & ads, curate homepage placements, and track campaign performance.",
    icon: Megaphone,
    tone: "warning",
  },
  navGroups: [
    {
      label: "Overview",
      items: [{ key: "home", label: "Home", icon: Home }, ANALYTICS_ITEM],
    },
    {
      label: "Users & Content",
      items: [
        { key: "creators", label: "Creators", icon: Users },
        { key: "projects", label: "Projects", icon: FolderKanban },
      ],
    },
    {
      label: "Monetization",
      items: [
        { key: "subscriptions", label: "Subscriptions", icon: CreditCard },
        { key: "promotions", label: "Promotions", icon: Megaphone },
      ],
    },
    { label: "Operations", items: OPERATIONS_ITEMS },
  ],
  home: {
    metrics: [
      { label: "Live Campaigns", value: "12", icon: Megaphone },
      { label: "Pending Review", value: "4", icon: Clock },
      { label: "Impressions (30d)", value: "14.2M", icon: TrendingUp },
      { label: "Ad Spend (30d)", value: "₦8.4M", icon: CreditCard },
    ],
    primary: {
      title: "Top Performing Campaigns",
      actionLabel: "Manage",
      items: [
        {
          id: "lagos-after-dark-home-banner",
          title: "Lagos After Dark — Home banner",
          subtitle: "CTR 4.8% · ₦820k spent",
          icon: Megaphone,
          tone: "primary",
        },
        {
          id: "the-quiet-hour-pre-roll",
          title: "The Quiet Hour — Pre-roll",
          subtitle: "CTR 3.1% · ₦540k spent",
          icon: Megaphone,
          tone: "primary",
        },
        {
          id: "weekend-watchlist-for-you",
          title: "Weekend Watchlist — For You",
          subtitle: "CTR 2.6% · ₦310k spent",
          icon: Megaphone,
          tone: "primary",
        },
      ],
    },
    side: [
      {
        kind: "items",
        title: "Awaiting your call",
        items: [
          {
            id: "campaigns-pending-review",
            title: "4 campaigns pending review",
            subtitle: "Oldest waiting 6h",
            icon: Clock,
            tone: "warning",
          },
          {
            id: "placements-unsold",
            title: "3 placements unsold",
            subtitle: "Home banner · Friday slot",
            icon: Sparkles,
            tone: "primary",
          },
        ],
      },
      {
        kind: "progress",
        title: "Placement fill",
        rows: [
          { label: "Home banner", value: "9", percent: 92, tone: "positive" },
          { label: "For You feed", value: "22", percent: 55, tone: "primary" },
          { label: "Pre-roll", value: "6", percent: 30, tone: "warning" },
        ],
      },
    ],
  },
}
