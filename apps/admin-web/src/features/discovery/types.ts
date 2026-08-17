export type DiscoverySurface = "home" | "for-you"

export type RailStatus = "live" | "draft" | "scheduled"

export type RailType = "hero" | "rail"

export type RailAudience = "all-users" | "new-users"

export interface RailContentItem {
  id: string
  title: string
  genre: string
  episodeCount: number
}

export interface DiscoveryRail {
  id: string
  title: string
  surface: DiscoverySurface
  type: RailType
  status: RailStatus
  audience: RailAudience
  position: number
  isVisible: boolean
  collectionKey?: string | null
  items: RailContentItem[]
}

export interface AvailableSeries {
  id: string
  title: string
  genre: string
  episodeCount: number
}
