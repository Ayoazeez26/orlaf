import {
  AlertTriangle,
  Clock,
  FolderKanban,
  Home,
  MessageSquare,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react"
import type { WorkspaceConfig } from "../../types"
import { DEMO_USER, OPERATIONS_ITEMS } from "../shared"

export const SUPPORT_ADMIN: WorkspaceConfig = {
  id: "support-admin",
  name: "Customer Support",
  user: DEMO_USER,
  picker: {
    title: "Moderation + Customer Support",
    description:
      "Triage flagged content, resolve user tickets, and keep the community safe.",
    icon: ShieldCheck,
    tone: "danger",
  },
  navGroups: [
    {
      label: "Overview",
      items: [{ key: "home", label: "Home", icon: Home }],
    },
    {
      label: "Users & Content",
      items: [
        { key: "creators", label: "Creators", icon: Users },
        { key: "onboarding", label: "Onboarding", icon: UserPlus },
        { key: "projects", label: "Projects", icon: FolderKanban },
        { key: "moderation", label: "Moderation", icon: ShieldCheck },
      ],
    },
    { label: "Operations", items: OPERATIONS_ITEMS },
  ],
  home: {
    metrics: [
      { label: "Open Reports", value: "23", icon: AlertTriangle },
      { label: "Pending Verification", value: "18", icon: ShieldCheck },
      { label: "Support Tickets", value: "41", icon: MessageSquare },
      { label: "Avg. Response", value: "1h 12m", icon: Clock },
    ],
    primary: {
      title: "Flagged content",
      actionLabel: "Open queue",
      items: [
        {
          id: "thumbnail-policy-hustlers",
          title: "Thumbnail policy — 'Hustlers EP 3'",
          subtitle: "2 reports · High severity",
          icon: AlertTriangle,
          tone: "danger",
        },
        {
          id: "spam-comments-okafor",
          title: "Spam comments — @okafor.films",
          subtitle: "6 reports · Medium",
          icon: AlertTriangle,
          tone: "warning",
        },
        {
          id: "copyright-claim-market-days",
          title: "Copyright claim — 'Market Days'",
          subtitle: "1 report · Pending creator reply",
          icon: AlertTriangle,
          tone: "warning",
        },
      ],
    },
    side: [
      {
        kind: "items",
        title: "Support inbox",
        items: [
          {
            id: "payout-question-adaeze",
            title: "Payout question — Adaeze O.",
            subtitle: "Waiting 14m",
            icon: MessageSquare,
            tone: "warning",
          },
          {
            id: "login-issue-viewers",
            title: "Login issue — 3 viewers",
            subtitle: "Auto-grouped",
            icon: Users,
            tone: "primary",
          },
          {
            id: "refund-request-coin-bundle",
            title: "Refund request — coin bundle",
            subtitle: "Escalated",
            icon: AlertTriangle,
            tone: "danger",
          },
        ],
      },
      {
        kind: "progress",
        title: "Today",
        rows: [
          { label: "Resolved", value: "32", percent: 80, tone: "positive" },
          { label: "In progress", value: "11", percent: 35, tone: "primary" },
          { label: "Escalated", value: "4", percent: 12, tone: "danger" },
        ],
      },
    ],
  },
}
