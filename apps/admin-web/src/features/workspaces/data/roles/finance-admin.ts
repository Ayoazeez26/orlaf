import {
  Banknote,
  Coins,
  CreditCard,
  FolderKanban,
  Home,
  Link,
  Megaphone,
  Split,
  Users,
  Wallet,
} from "lucide-react"
import type { WorkspaceConfig } from "../../types"
import { ANALYTICS_ITEM, DEMO_USER, OPERATIONS_ITEMS } from "../shared"

export const FINANCE_ADMIN: WorkspaceConfig = {
  id: "finance-admin",
  name: "Finance Admin",
  user: DEMO_USER,
  picker: {
    title: "Finance Admin",
    description:
      "Oversee subscriptions, coin economy, revenue splits, and creator payouts.",
    icon: Wallet,
    tone: "info",
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
        { key: "coin-economy", label: "Coin Economy", icon: Link },
        { key: "payouts", label: "Payouts", icon: Banknote },
        { key: "revenue-split", label: "Revenue Split", icon: Split },
        { key: "subscriptions", label: "Subscriptions", icon: CreditCard },
        { key: "promotions", label: "Promotions", icon: Megaphone },
      ],
    },
    { label: "Operations", items: OPERATIONS_ITEMS },
  ],
  home: {
    metrics: [
      { label: "MRR", value: "₦42.8M", icon: Wallet },
      { label: "Active Subscribers", value: "18,420", icon: Users },
      { label: "Coins in Circulation", value: "6.2M", icon: Coins },
      { label: "Pending Payouts", value: "₦12.4M", icon: Banknote },
    ],
    primary: {
      title: "Payout Cycle",
      actionLabel: "View cycle",
      progress: [
        { label: "Approved", value: "68", percent: 85, tone: "positive" },
        { label: "In review", value: "22", percent: 32, tone: "warning" },
        { label: "Held", value: "4", percent: 10, tone: "danger" },
      ],
      items: [
        {
          id: "payouts-awaiting-approval",
          title: "14 payouts awaiting approval",
          subtitle: "Cycle closes in 2 days",
          icon: Banknote,
          tone: "positive",
        },
        {
          id: "failed-subscriptions",
          title: "3 failed subscriptions",
          subtitle: "Retry in next dunning step",
          icon: CreditCard,
          tone: "danger",
        },
      ],
    },
    side: [
      {
        kind: "items",
        title: "Coin economy",
        items: [
          {
            id: "bundle-500-coins",
            title: "Bundle: 500 coins",
            subtitle: "Top seller · 1,240 sold this week",
            icon: Coins,
            tone: "warning",
          },
          {
            id: "tip-earn-rate",
            title: "Tip earn rate",
            subtitle: "Creator share at 70%",
            icon: Coins,
            tone: "warning",
          },
        ],
      },
      {
        kind: "stats",
        title: "This month",
        rows: [
          { label: "Net revenue", value: "₦38.1M" },
          { label: "Platform fees", value: "₦5.7M" },
          { label: "Refunds", value: "₦240k" },
        ],
      },
    ],
  },
}
