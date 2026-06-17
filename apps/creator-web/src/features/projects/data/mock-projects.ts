import { PROJECT_THUMBNAILS } from "../constants"
import type { ProjectDetail, ProjectSummary } from "../types"

const JOLLOF_DESCRIPTION =
  "A gripping tale of love, power, and deception in the heart of Lagos's elite social circles. When a contract marriage between two powerful families turns into something real, secrets threaten to destroy everything."

const JOLLOF_EPISODES = [
  {
    id: "jw-1",
    number: 1,
    title: "The Meeting",
    duration: "3:24",
    views: "125K",
    revenue: "$0",
    access: "free" as const,
    locked: false,
  },
  {
    id: "jw-2",
    number: 2,
    title: "The Contract",
    duration: "4:10",
    views: "98K",
    revenue: "1,240",
    access: "coins" as const,
    locked: true,
  },
  {
    id: "jw-3",
    number: 3,
    title: "Hidden Truth",
    duration: "3:58",
    views: "87K",
    revenue: "980",
    access: "coins" as const,
    locked: true,
  },
  {
    id: "jw-4",
    number: 4,
    title: "The Betrayal",
    duration: "5:02",
    views: "72K",
    revenue: "860",
    access: "premium" as const,
    locked: true,
  },
  {
    id: "jw-5",
    number: 5,
    title: "Aftermath",
    duration: "4:45",
    views: "65K",
    revenue: "720",
    access: "coins" as const,
    locked: true,
  },
]

export const MOCK_PROJECT_SUMMARIES: ProjectSummary[] = [
  {
    id: "lagos-after-dark",
    slug: "lagos-after-dark",
    title: "Lagos After Dark",
    type: "Short series",
    status: "published",
    episodeCount: 4,
    updatedAt: "2d ago",
    updatedAtMs: Date.now() - 172_800_000,
    genre: "Drama",
    language: "English",
    views: "24.3k views",
    iconVariant: "purple",
  },
  {
    id: "studio-sessions-tems",
    slug: "studio-sessions-tems",
    title: "Studio Sessions: Tems",
    type: "Short movie",
    status: "in_review",
    duration: "18:34",
    updatedAt: "5h ago",
    updatedAtMs: Date.now() - 18_000_000,
    genre: "Documentary",
    language: "English",
    iconVariant: "pink",
  },
  {
    id: "sable-shorts-vol-2",
    slug: "sable-shorts-vol-2",
    title: "Sable Shorts — Vol. 2",
    type: "Short series",
    status: "draft",
    episodeCount: 0,
    updatedAt: "1d ago",
    updatedAtMs: Date.now() - 86_400_000,
    genre: "Anthology",
    language: "English",
    iconVariant: "blue",
  },
  {
    id: "jollof-wars",
    slug: "jollof-wars",
    title: "Jollof Wars",
    thumbnailUrl: PROJECT_THUMBNAILS.jollofWars,
    type: "Short series",
    status: "published",
    episodeCount: 4,
    updatedAt: "2 hours ago",
    updatedAtMs: Date.now() - 7_200_000,
    genre: "Romance / Drama",
    language: "English",
    views: "1.2M views",
    iconVariant: "purple",
  },
  {
    id: "the-returnees",
    slug: "the-returnees",
    title: "The Returnees",
    thumbnailUrl: PROJECT_THUMBNAILS.theReturnees,
    type: "Short series",
    status: "draft",
    episodeCount: 12,
    updatedAt: "3 days ago",
    updatedAtMs: Date.now() - 259_200_000,
    genre: "Drama",
    language: "English",
    iconVariant: "blue",
  },
]

function summaryById(id: string): ProjectSummary {
  const summary = MOCK_PROJECT_SUMMARIES.find((p) => p.id === id)
  if (!summary) throw new Error(`Missing mock project: ${id}`)
  return summary
}

const JOLLOF_DETAIL: ProjectDetail = {
  ...summaryById("jollof-wars"),
  description: JOLLOF_DESCRIPTION,
  totalViews: "1.2M",
  revenue: "8,420",
  subscribers: "24.5K",
  avgWatchTime: "3:42",
  tags: ["Romance", "Drama", "Lagos", "Elite"],
  createdAt: "Jan 15, 2026",
  visibility: {
    public: true,
    listedInSearch: true,
    commentsEnabled: true,
  },
  monetization: {
    tippingEnabled: false,
    seriesRevenue: "8,420",
  },
  overviewMetrics: [
    { label: "Total Views", value: "1.2M", change: "+12%", icon: "views" },
    { label: "Revenue", value: "8,420", change: "+24%", icon: "revenue" },
    {
      label: "Subscribers",
      value: "24.5K",
      change: "+8%",
      icon: "subscribers",
    },
    {
      label: "Avg. Watch Time",
      value: "3:42",
      change: "+5%",
      icon: "watchTime",
    },
  ],
  analyticsMetrics: [
    { label: "Total Views", value: "1.2M", change: "+12%", icon: "views" },
    { label: "Watch Time", value: "4,120h", change: "+8%", icon: "watchTime" },
    {
      label: "Completion Rate",
      value: "68%",
      change: "+3%",
      icon: "completion",
    },
    { label: "Revenue", value: "8,420", change: "+24%", icon: "revenue" },
  ],
  recentEpisodes: JOLLOF_EPISODES.slice(0, 4),
  episodes: JOLLOF_EPISODES,
  weeklyViews: [
    { day: "Mon", views: 4200 },
    { day: "Tue", views: 5800 },
    { day: "Wed", views: 5100 },
    { day: "Thu", views: 7200 },
    { day: "Fri", views: 8900 },
    { day: "Sat", views: 10500 },
    { day: "Sun", views: 9800 },
  ],
}

function buildGenericDetail(summary: ProjectSummary): ProjectDetail {
  const episodeCount = summary.episodeCount ?? 0

  return {
    ...summary,
    thumbnailUrl: summary.thumbnailUrl ?? PROJECT_THUMBNAILS.jollofWars,
    episodeCount,
    description: JOLLOF_DESCRIPTION,
    totalViews: "420K",
    revenue: "2,100",
    subscribers: "8.2K",
    avgWatchTime: "2:58",
    tags: [summary.genre?.split(" / ")[0] ?? "Drama", "Lagos"],
    createdAt: "Feb 1, 2026",
    visibility: {
      public: summary.status === "published",
      listedInSearch: summary.status === "published",
      commentsEnabled: true,
    },
    monetization: {
      tippingEnabled: false,
      seriesRevenue: "2,100",
    },
    overviewMetrics: JOLLOF_DETAIL.overviewMetrics,
    analyticsMetrics: JOLLOF_DETAIL.analyticsMetrics,
    recentEpisodes: JOLLOF_EPISODES.slice(0, 3),
    episodes: JOLLOF_EPISODES.slice(0, episodeCount > 4 ? 4 : episodeCount),
    weeklyViews: JOLLOF_DETAIL.weeklyViews,
  }
}

export const MOCK_PROJECT_DETAILS: Record<string, ProjectDetail> = {
  "jollof-wars": JOLLOF_DETAIL,
  "lagos-after-dark": buildGenericDetail(summaryById("lagos-after-dark")),
  "studio-sessions-tems": buildGenericDetail(
    summaryById("studio-sessions-tems")
  ),
  "sable-shorts-vol-2": buildGenericDetail(summaryById("sable-shorts-vol-2")),
  "the-returnees": buildGenericDetail(summaryById("the-returnees")),
}

export const DEFAULT_UPLOAD_EPISODES = [
  {
    id: "ep-1",
    title: "The Awakening",
    synopsis:
      "After years abroad, Amara returns to Lagos and discovers her family's empire is crumbling.",
    duration: "4:32",
    access: "free" as const,
    autoCaption: true,
  },
  {
    id: "ep-2",
    title: "Crossroads",
    synopsis:
      "A chance encounter forces Amara to choose between duty and desire.",
    duration: "3:58",
    access: "coins" as const,
    autoCaption: true,
  },
  {
    id: "ep-3",
    title: "The Pact",
    synopsis:
      "Secrets from the past surface as alliances shift in unexpected ways.",
    duration: "5:10",
    access: "coins" as const,
    autoCaption: true,
  },
  {
    id: "ep-4",
    title: "Revelations",
    synopsis:
      "The truth about the family's fortune threatens to tear everyone apart.",
    duration: "4:45",
    access: "coins" as const,
    autoCaption: true,
  },
  {
    id: "ep-5",
    title: "The Reckoning",
    synopsis:
      "Amara must confront the consequences of every choice she's made.",
    duration: "6:02",
    access: "premium" as const,
    autoCaption: true,
  },
]
