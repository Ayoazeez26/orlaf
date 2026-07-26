export type PlaybackDeviceType = "mobile" | "desktop" | "tablet" | "tv"

export type PlaybackPlatform = "ios" | "android" | "web"

export type PlaybackSource =
  | "for_you"
  | "series"
  | "search"
  | "share"
  | "external"

export interface StartPlaybackSessionRequest {
  episode_id: string
  anon_id?: string | null
  device_type: PlaybackDeviceType
  platform?: PlaybackPlatform | null
  source?: PlaybackSource | null
  app_version?: string | null
}

export interface StartPlaybackSessionResponse {
  session_id: string
}

export interface PlaybackHeartbeatRequest {
  watched_seconds: number
  max_position_seconds: number
  completed?: boolean
  ended?: boolean
}

export interface PlaybackHeartbeatResponse {
  session_id: string
  counted_as_view: boolean
}
