export type DiscoverySurface = "home" | "for-you"
export type DiscoveryRailType = "hero" | "rail"
export type DiscoveryRailStatus = "live" | "draft" | "scheduled"
export type DiscoveryAudience = "all-users" | "new-users"

export interface DiscoveryRailItem {
  id: string
  title: string
  genre: string
  episodeCount: number
}

export interface DiscoveryRail {
  id: string
  title: string
  surface: DiscoverySurface
  type: DiscoveryRailType
  status: DiscoveryRailStatus
  audience: DiscoveryAudience
  position: number
  isVisible: boolean
  collectionKey: string | null
  items: DiscoveryRailItem[]
}

export interface DiscoveryRailsResponse {
  rails: DiscoveryRail[]
}

export interface CreateDiscoveryRailRequest {
  title: string
  surface: DiscoverySurface
  type?: DiscoveryRailType
  status?: DiscoveryRailStatus
  audience?: DiscoveryAudience
  collectionKey?: string | null
}

export interface UpdateDiscoveryRailRequest {
  title?: string
  type?: DiscoveryRailType
  status?: DiscoveryRailStatus
  audience?: DiscoveryAudience
  isVisible?: boolean
  collectionKey?: string | null
}

export interface ReorderDiscoveryRailsRequest {
  railIds: string[]
}

export interface AddDiscoveryRailItemRequest {
  seriesId: string
}
