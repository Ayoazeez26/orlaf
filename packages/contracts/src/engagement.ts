export type ShareChannel =
  | "whatsapp"
  | "telegram"
  | "x"
  | "facebook"
  | "stories"
  | "email"
  | "qr"
  | "more"
  | "copy"
  | "native"

export interface SeriesEngagementSummary {
  series_id: string
  like_count: number
  comment_count: number
  share_count: number
  save_count: number
  liked_by_me: boolean
  saved_by_me: boolean
}

export interface SeriesLikeStatusResponse {
  liked: boolean
  like_count: number
}

export interface CommentAuthor {
  id: string
  display_name: string
  initials: string
  avatar_url: string | null
}

export interface SeriesComment {
  id: string
  series_id: string
  parent_id: string | null
  body: string
  pinned: boolean
  created_at: string
  author: CommentAuthor
  reply_to_author: string | null
  like_count: number
  reply_count: number
  liked_by_me: boolean
  is_mine: boolean
  /** Present on top-level comments when listing a thread feed. */
  replies?: SeriesComment[]
}

export interface SeriesCommentsListResponse {
  items: SeriesComment[]
  total: number
  next_cursor: string | null
}

export interface CreateSeriesCommentRequest {
  body: string
  parent_id?: string | null
}

export interface RecordShareRequest {
  channel: ShareChannel
}
