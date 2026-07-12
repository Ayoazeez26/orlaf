export type CreatorStatus = "active" | "suspended"

export type CreatorProjectStatus =
  | "published"
  | "in-review"
  | "draft"
  | "scheduled"

export interface Creator {
  id: string
  name: string
  email: string
  username: string
  initials: string
  location: string
  views: number
  earnings: number
  status: CreatorStatus
  isNew: boolean
}

export interface TopProject {
  title: string
  duration: string
  views: number
}

export interface CreatorProject {
  id: string
  title: string
  type: string
  genre: string
  meta: string
  updated: string
  views?: number
  status: CreatorProjectStatus
}

export interface ViewershipPoint {
  month: string
  views: number
  previous: number
}

export interface DeviceShare {
  device: string
  share: number
}

export interface EngagementPoint {
  day: string
  likes: number
  shares: number
  comments: number
}

export interface TopEpisode {
  title: string
  series: string
  views: number
  trend: number
}

export interface AudienceCountry {
  country: string
  count: number
  share: number
}

export interface CreatorPayout {
  bank: string
  account: string
  date: string
  amount: number
}

export interface CreatorAnalytics {
  totalViews: number
  uniqueViewers: number
  avgWatchTime: string
  totalEarnings: number
  viewershipTrend: ViewershipPoint[]
  deviceShare: DeviceShare[]
  engagementByDay: EngagementPoint[]
  topEpisodes: TopEpisode[]
  audienceByCountry: AudienceCountry[]
}

export interface CreatorDetail extends Creator {
  bio: string
  joined: string
  role: string
  tags: string[]
  topProjects: TopProject[]
  projects: CreatorProject[]
  analytics: CreatorAnalytics
  payouts: CreatorPayout[]
}
