import type { ProjectDetail } from "../types"
import { MOCK_PROJECTS } from "./mock-projects"

const DEFAULT_EPISODES: ProjectDetail["episodes"] = [
  {
    id: "ep-1",
    number: 1,
    title: "The Meeting",
    duration: "3:00",
    size: "35.5 MB",
    views: 125_000,
    status: "published",
  },
  {
    id: "ep-2",
    number: 2,
    title: "The Contract",
    duration: "3:41",
    size: "42.2 MB",
    views: 98_000,
    status: "published",
  },
  {
    id: "ep-3",
    number: 3,
    title: "Hidden Truth",
    duration: "3:20",
    size: "38.1 MB",
    views: 87_000,
    status: "published",
  },
  {
    id: "ep-4",
    number: 4,
    title: "The Betrayal",
    duration: "3:45",
    size: "41.8 MB",
    views: 72_000,
    status: "published",
  },
]

const DEFAULT_TOP_EPISODES: ProjectDetail["topEpisodes"] = [
  { rank: 1, title: "The Meeting", duration: "3:24", views: 125_000 },
  { rank: 2, title: "The Contract", duration: "3:41", views: 98_000 },
  { rank: 3, title: "Hidden Truth", duration: "3:20", views: 87_000 },
  { rank: 4, title: "The Betrayal", duration: "3:45", views: 72_000 },
]

const DEFAULT_ANALYTICS: ProjectDetail["analytics"] = {
  totalViews: 2_487,
  revenue: 1_204,
  subscribers: 88_200_000,
  avgWatchTime: "342",
  viewsThisWeek: [
    { day: "Mon", views: 4200 },
    { day: "Tue", views: 5100 },
    { day: "Wed", views: 6300 },
    { day: "Thu", views: 7200 },
    { day: "Fri", views: 8400 },
    { day: "Sat", views: 11_200 },
    { day: "Sun", views: 9800 },
  ],
  topEpisodes: DEFAULT_TOP_EPISODES,
}

const DEFAULT_MODERATION: ProjectDetail["moderationReports"] = [
  {
    id: "mod-1",
    content: "Episode 5 - The Confrontation",
    severity: "high",
    reason: "Inappropriate content",
    status: "pending",
    reported: "2 hours ago",
  },
  {
    id: "mod-2",
    content: "The Returnees S2 Trailer",
    severity: "medium",
    reason: "Copyright claim",
    status: "reviewed",
    reported: "1 day ago",
  },
  {
    id: "mod-3",
    content: "The Returnees",
    severity: "low",
    reason: "Misleading thumbnail",
    status: "resolved",
    reported: "3 days ago",
  },
]

const DETAIL_OVERRIDES: Partial<
  Record<
    string,
    Partial<Omit<ProjectDetail, keyof (typeof MOCK_PROJECTS)[number]>>
  >
> = {
  "the-returnees": {
    description:
      "A gripping tale of love, power, and second chances. When a group of returnees arrives in Lagos, old flames reignite and new alliances form in this vertical drama series.",
    created: "Jan 15, 2026",
    creatorEmail: "adaeze@email.com",
    creatorUsername: "@adaeze_films",
    creatorInitials: "AO",
    episodes: DEFAULT_EPISODES,
    topEpisodes: DEFAULT_TOP_EPISODES,
    analytics: DEFAULT_ANALYTICS,
    moderationReports: DEFAULT_MODERATION,
  },
  "zulu-dawn": {
    description:
      "An epic drama following a family caught between tradition and modernity in post-apartheid South Africa.",
    created: "Dec 8, 2025",
    creatorEmail: "adaeze@email.com",
    creatorUsername: "@adaeze_films",
    creatorInitials: "AO",
    episodes: DEFAULT_EPISODES.slice(0, 3),
    topEpisodes: DEFAULT_TOP_EPISODES.slice(0, 3),
    analytics: DEFAULT_ANALYTICS,
    moderationReports: [],
  },
}

function buildDetail(project: (typeof MOCK_PROJECTS)[number]): ProjectDetail {
  const override = DETAIL_OVERRIDES[project.id] ?? {}

  return {
    ...project,
    description:
      override.description ??
      `${project.title} is a ${project.genre.toLowerCase()} series by ${project.creatorName}.`,
    created: override.created ?? "Jan 1, 2026",
    creatorEmail: override.creatorEmail ?? "creator@email.com",
    creatorUsername: override.creatorUsername ?? "@creator",
    creatorInitials: override.creatorInitials ?? "CR",
    episodes: override.episodes ?? DEFAULT_EPISODES,
    topEpisodes: override.topEpisodes ?? DEFAULT_TOP_EPISODES,
    analytics: override.analytics ?? DEFAULT_ANALYTICS,
    moderationReports: override.moderationReports ?? [],
  }
}

export function getProjectDetail(id: string): ProjectDetail | undefined {
  const project = MOCK_PROJECTS.find((item) => item.id === id)
  return project ? buildDetail(project) : undefined
}

export function formatProjectViews(views: number | null): string {
  if (views == null) return "—"
  if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  }
  if (views >= 1_000) {
    return `${Math.round(views / 1_000)}K`
  }
  return views.toLocaleString()
}

export function formatProjectSubscribers(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  }
  return count.toLocaleString()
}

export function projectSubtitle(project: {
  genre: string
  language: string
  episodeCount: number
}): string {
  return `${project.genre} • ${project.language} • ${project.episodeCount} episodes`
}
