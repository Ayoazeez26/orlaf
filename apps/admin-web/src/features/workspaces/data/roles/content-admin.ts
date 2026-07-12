import {
  Clock,
  FileText,
  Film,
  FolderKanban,
  Home,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react"
import type { WorkspaceConfig } from "../../types"
import { ANALYTICS_ITEM, DEMO_USER, OPERATIONS_ITEMS } from "../shared"

export const CONTENT_ADMIN: WorkspaceConfig = {
  id: "content-admin",
  name: "Content Admin",
  user: DEMO_USER,
  picker: {
    title: "Content Admin",
    description:
      "Manage creators, projects, onboarding, homepage curation, and moderation.",
    icon: Film,
    tone: "positive",
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
        { key: "onboarding", label: "Onboarding", icon: UserPlus },
        { key: "projects", label: "Projects", icon: FolderKanban },
        { key: "discovery", label: "Discovery", icon: Sparkles },
        { key: "moderation", label: "Moderation", icon: ShieldCheck },
      ],
    },
    { label: "Operations", items: OPERATIONS_ITEMS },
  ],
  home: {
    metrics: [
      { label: "Projects Live", value: "1,204", icon: FolderKanban },
      { label: "Pending Review", value: "47", icon: Clock },
      { label: "Onboarding Queue", value: "18", icon: Users },
      { label: "Discovery Slots Open", value: "6", icon: Sparkles },
    ],
    primary: {
      title: "Submission Queue",
      actionLabel: "View all",
      items: [
        {
          id: "lagos-after-dark-ep4",
          title: "Lagos After Dark — Episode 4",
          subtitle: "Submitted by @lucid_productions · 2h ago",
          icon: FileText,
          tone: "primary",
        },
        {
          id: "the-quiet-hour-trailer",
          title: "The Quiet Hour — Trailer",
          subtitle: "Submitted by @northroad · 5h ago",
          icon: FileText,
          tone: "primary",
        },
        {
          id: "documentary-market-days",
          title: "Documentary: Market Days",
          subtitle: "Submitted by @okafor.films · yesterday",
          icon: FileText,
          tone: "primary",
        },
      ],
    },
    side: [
      {
        kind: "progress",
        title: "Discovery Health",
        rows: [
          {
            label: "Home shelves filled",
            value: "14",
            percent: 88,
            tone: "positive",
          },
          {
            label: "For You diversity",
            value: "72",
            percent: 72,
            tone: "primary",
          },
          {
            label: "Stale hero (>7d)",
            value: "3",
            percent: 18,
            tone: "warning",
          },
        ],
      },
      {
        kind: "items",
        title: "Jump back in",
        items: [
          {
            id: "creator-applications",
            title: "New creator applications",
            subtitle: "6 awaiting verification",
            icon: UserPlus,
            tone: "primary",
          },
          {
            id: "curate-home-rails",
            title: "Curate Home rails",
            subtitle: "Refresh weekend lineup",
            icon: Sparkles,
            tone: "primary",
          },
        ],
      },
    ],
  },
}
