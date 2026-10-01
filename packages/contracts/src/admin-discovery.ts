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

// ---------------------------------------------------------------------------
// For You: live ranking preview + editorial overrides
// ---------------------------------------------------------------------------

export type ForYouOverrideMode = "pin" | "hide"

/** How a series' For You score was built; `total` is what ranks it. */
export interface ForYouScoreBreakdown {
  views: number
  likes: number
  shares: number
  comments: number
  recencyBoost: number
  total: number
}

export interface ForYouPin {
  /** 1-based feed slot. */
  position: number
  endsAt: string | null
}

export interface ForYouPreviewItem {
  /** 1-based position in the feed order, after pins are applied. */
  rank: number
  /** Whether this rank is within the feed the app receives. */
  inFeed: boolean
  seriesId: string
  title: string
  posterUrl: string | null
  creatorName: string | null
  /** What the app plays for this series: its trailer or its first free episode. */
  kind: "trailer" | "episode"
  episodeTitle: string | null
  score: ForYouScoreBreakdown
  pin: ForYouPin | null
}

export interface ForYouHiddenItem {
  seriesId: string
  title: string
  posterUrl: string | null
  endsAt: string | null
}

export interface ForYouIneligibleItem {
  seriesId: string
  title: string
  posterUrl: string | null
  reason: string
  /** Set when the series is pinned but cannot play, so the pin has no effect. */
  pin: ForYouPin | null
}

export interface ForYouPreviewResponse {
  /** Every playable series in feed order; the first `feedLimit` reach the app. */
  items: ForYouPreviewItem[]
  hidden: ForYouHiddenItem[]
  ineligible: ForYouIneligibleItem[]
  feedLimit: number
  generatedAt: string
}

export interface SetForYouOverrideRequest {
  mode: ForYouOverrideMode
  /** 1-based slot for pins (defaults to 1); ignored for hides. */
  position?: number
  /** ISO time after which the override stops applying; null or omitted = indefinitely. */
  endsAt?: string | null
}
