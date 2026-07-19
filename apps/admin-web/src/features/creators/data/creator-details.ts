import type { Creator, CreatorDetail } from "../types"
import { MOCK_CREATORS } from "./mock-creators"

const DEFAULT_ANALYTICS: CreatorDetail["analytics"] = {
  totalViews: 2_520_000,
  uniqueViewers: 1_100_000,
  avgWatchTime: "3:47",
  totalEarnings: 29_500,
  viewershipTrend: [
    { month: "Jan", views: 3200, previous: 2800 },
    { month: "Feb", views: 3600, previous: 3000 },
    { month: "Mar", views: 4100, previous: 3400 },
    { month: "Apr", views: 4500, previous: 3800 },
    { month: "May", views: 4800, previous: 4200 },
    { month: "Jun", views: 5200, previous: 4600 },
    { month: "Jul", views: 5600, previous: 5000 },
  ],
  deviceShare: [
    { device: "Mobile", share: 58 },
    { device: "Desktop", share: 28 },
    { device: "Tablet", share: 14 },
  ],
  engagementByDay: [
    { day: "Mon", likes: 52, shares: 28, comments: 18 },
    { day: "Tue", likes: 48, shares: 24, comments: 16 },
    { day: "Wed", likes: 72, shares: 38, comments: 24 },
    { day: "Thu", likes: 64, shares: 32, comments: 20 },
    { day: "Fri", likes: 80, shares: 42, comments: 28 },
    { day: "Sat", likes: 68, shares: 36, comments: 22 },
    { day: "Sun", likes: 44, shares: 22, comments: 14 },
  ],
  topEpisodes: [
    {
      title: "The Meeting",
      series: "The Returnees",
      views: 125_000,
      trend: 12.4,
    },
    {
      title: "The Contract",
      series: "The Returnees",
      views: 98_000,
      trend: 8.2,
    },
    {
      title: "Hidden Truth",
      series: "The Returnees",
      views: 87_000,
      trend: -2.1,
    },
    {
      title: "The Betrayal",
      series: "The Returnees",
      views: 72_000,
      trend: 5.6,
    },
    { title: "New Beginnings", series: "Zulu Dawn", views: 64_000, trend: 3.8 },
  ],
  audienceByCountry: [
    { country: "Nigeria", count: 420_000, share: 38 },
    { country: "South Africa", count: 185_000, share: 17 },
    { country: "Kenya", count: 142_000, share: 13 },
    { country: "Ghana", count: 98_000, share: 9 },
    { country: "United States", count: 76_000, share: 7 },
  ],
}

const DETAIL_OVERRIDES: Partial<Record<string, Partial<CreatorDetail>>> = {
  "adaeze-okafor": {
    bio: "Award-winning vertical drama creator from Lagos. Specialises in romance and thriller series with cinematic production quality and strong audience retention across West Africa.",
    joined: "Mar 12 2025",
    role: "Creator",
    tags: ["Top Creator", "New Creator", "Popular", "Elite"],
    topProjects: [
      { title: "The Meeting", duration: "3:24", views: 125_000 },
      { title: "The Contract", duration: "4:10", views: 98_000 },
      { title: "Hidden Truth", duration: "3:58", views: 87_000 },
      { title: "The Betrayal", duration: "5:02", views: 72_000 },
    ],
    projects: [
      {
        id: "lagos-after-dark",
        title: "Lagos After Dark",
        type: "Short series",
        genre: "Drama",
        meta: "4 eps",
        updated: "2d ago",
        views: 24_300,
        status: "published",
      },
      {
        id: "studio-sessions-tems",
        title: "Studio Sessions: Tems",
        type: "Short movie",
        genre: "Documentary",
        meta: "18:34",
        updated: "5h ago",
        status: "in-review",
      },
      {
        id: "sable-shorts-vol-2",
        title: "Sable Shorts — Vol. 2",
        type: "Short series",
        genre: "Anthology",
        meta: "0 eps",
        updated: "1d ago",
        status: "draft",
      },
    ],
    analytics: DEFAULT_ANALYTICS,
    payouts: [
      {
        bank: "GTBank",
        account: "••4521",
        date: "Mar 20, 2026",
        amount: 2500,
      },
      {
        bank: "GTBank",
        account: "••4521",
        date: "Feb 28, 2026",
        amount: 1800,
      },
      {
        bank: "GTBank",
        account: "••4521",
        date: "Jan 31, 2026",
        amount: 3200,
      },
      {
        bank: "Access Bank",
        account: "••8903",
        date: "Dec 31, 2025",
        amount: 2100,
      },
    ],
  },
}

export function buildDetail(creator: Creator): CreatorDetail {
  const override = DETAIL_OVERRIDES[creator.id] ?? {}

  return {
    ...creator,
    bio:
      override.bio ??
      `${creator.name} is a vertical drama creator based in ${creator.location}.`,
    joined: override.joined ?? "2025",
    role: override.role ?? "Creator",
    tags: override.tags ?? ["Creator"],
    topProjects: override.topProjects ?? [
      { title: "Pilot Episode", duration: "4:00", views: 12_000 },
    ],
    projects: override.projects ?? [
      {
        id: "default-project",
        title: "Untitled Project",
        type: "Short series",
        genre: "Drama",
        meta: "0 eps",
        updated: "1w ago",
        status: "draft",
      },
    ],
    analytics: override.analytics ?? {
      ...DEFAULT_ANALYTICS,
      totalEarnings: creator.earnings,
      totalViews: creator.views,
    },
    payouts: override.payouts ?? [
      {
        bank: "GTBank",
        account: "••0000",
        date: "Jan 31, 2026",
        amount: creator.earnings * 0.1,
      },
    ],
  }
}

export function getCreatorDetail(id: string): CreatorDetail | undefined {
  const creator = MOCK_CREATORS.find((c) => c.id === id)
  return creator ? buildDetail(creator) : undefined
}

export function formatCreatorViews(views: number): string {
  if (views >= 1_000_000) {
    const value = views / 1_000_000
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}M`
  }
  if (views >= 1_000) {
    const value = views / 1_000
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}K`
  }
  return views.toLocaleString()
}

export function formatCreatorEarnings(amount: number): string {
  return `$${amount.toLocaleString()}`
}
