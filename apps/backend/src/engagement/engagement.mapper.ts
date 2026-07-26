import type { CommentAuthor, SeriesComment } from "@sable/contracts"

type AccountSnippet = {
  id: string
  displayName: string | null
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
}

export function mapCommentAuthor(account: AccountSnippet): CommentAuthor {
  const displayName =
    account.displayName?.trim() ||
    [account.firstName, account.lastName].filter(Boolean).join(" ").trim() ||
    "Viewer"

  const initialsSource =
    account.firstName?.trim() ||
    account.displayName?.replace(/^@/, "").trim() ||
    displayName

  const initials = initialsSource
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return {
    id: account.id,
    display_name: displayName,
    initials: initials || "V",
    avatar_url: account.avatarUrl,
  }
}

export function mapComment(input: {
  id: string
  seriesId: string
  parentId: string | null
  body: string
  pinnedAt: Date | null
  deletedAt: Date | null
  createdAt: Date
  accountId: string
  account: AccountSnippet
  replyToAuthor: string | null
  likeCount: number
  replyCount: number
  likedByMe: boolean
  viewerAccountId?: string | null
}): SeriesComment {
  const deleted = !!input.deletedAt

  return {
    id: input.id,
    series_id: input.seriesId,
    parent_id: input.parentId,
    body: deleted ? "" : input.body,
    pinned: !!input.pinnedAt && !deleted,
    created_at: input.createdAt.toISOString(),
    author: mapCommentAuthor(input.account),
    reply_to_author: deleted ? null : input.replyToAuthor,
    like_count: input.likeCount,
    reply_count: input.replyCount,
    liked_by_me: input.likedByMe,
    is_mine: input.viewerAccountId === input.accountId,
  }
}
