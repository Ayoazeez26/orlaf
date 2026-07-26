import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import type {
  CreateSeriesCommentRequest,
  RecordShareRequest,
  SeriesComment,
  SeriesCommentsListResponse,
  SeriesEngagementSummary,
  SeriesLikeStatusResponse,
} from "@sable/contracts"
import { PrismaService } from "../prisma/prisma.service"
import { mapComment } from "./engagement.mapper"

const ENGAGEABLE_SERIES_STATUSES = ["published"] as const
const COMMENT_PAGE_SIZE = 30
const REPLY_PAGE_SIZE = 50

const accountSelect = {
  id: true,
  displayName: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
} as const

const parentAuthorSelect = {
  displayName: true,
  firstName: true,
  lastName: true,
} as const

@Injectable()
export class EngagementService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertSeriesEngageable(seriesId: string) {
    const series = await this.prisma.series.findUnique({
      where: { id: seriesId },
      select: {
        id: true,
        status: true,
        isPublic: true,
        archivedAt: true,
        commentsEnabled: true,
      },
    })

    if (
      !series ||
      !ENGAGEABLE_SERIES_STATUSES.includes(
        series.status as (typeof ENGAGEABLE_SERIES_STATUSES)[number]
      ) ||
      !series.isPublic ||
      series.archivedAt
    ) {
      throw new NotFoundException("Series not found")
    }

    return series
  }

  private async assertCommentsEnabled(seriesId: string) {
    const series = await this.assertSeriesEngageable(seriesId)
    if (!series.commentsEnabled) {
      throw new ForbiddenException("Comments are disabled for this series")
    }
    return series
  }

  private resolveReplyToAuthor(comment: {
    parent?: {
      account?: {
        displayName: string | null
        firstName: string | null
        lastName: string | null
      } | null
    } | null
  }): string | null {
    const account = comment.parent?.account
    if (!account) return null
    return (
      account.displayName?.trim() ||
      [account.firstName, account.lastName].filter(Boolean).join(" ").trim() ||
      null
    )
  }

  private commentInclude(accountId?: string) {
    return {
      account: { select: accountSelect },
      parent: {
        select: {
          id: true,
          parentId: true,
          account: { select: parentAuthorSelect },
        },
      },
      _count: {
        select: {
          likes: true,
          replies: true,
        },
      },
      likes: accountId
        ? {
            where: { accountId },
            select: { id: true },
            take: 1,
          }
        : false,
    } as const
  }

  private toComment(
    comment: {
      id: string
      seriesId: string
      parentId: string | null
      body: string
      pinnedAt: Date | null
      deletedAt: Date | null
      createdAt: Date
      accountId: string
      account: {
        id: string
        displayName: string | null
        firstName: string | null
        lastName: string | null
        avatarUrl: string | null
      }
      parent?: {
        account?: {
          displayName: string | null
          firstName: string | null
          lastName: string | null
        } | null
      } | null
      _count: { likes: number; replies: number }
      likes?: { id: string }[] | false
    },
    viewerAccountId?: string,
    overrides?: Partial<Pick<SeriesComment, "parent_id" | "reply_count">>
  ): SeriesComment {
    return mapComment({
      id: comment.id,
      seriesId: comment.seriesId,
      parentId: overrides?.parent_id ?? comment.parentId,
      body: comment.body,
      pinnedAt: comment.pinnedAt,
      deletedAt: comment.deletedAt,
      createdAt: comment.createdAt,
      accountId: comment.accountId,
      account: comment.account,
      replyToAuthor: this.resolveReplyToAuthor(comment),
      likeCount: comment._count.likes,
      replyCount: overrides?.reply_count ?? comment._count.replies,
      likedByMe: Array.isArray(comment.likes) && comment.likes.length > 0,
      viewerAccountId,
    })
  }

  async getSummary(
    seriesId: string,
    accountId?: string
  ): Promise<SeriesEngagementSummary> {
    await this.assertSeriesEngageable(seriesId)

    const [likeCount, commentCount, shareCount, saveCount, liked, saved] =
      await Promise.all([
        this.prisma.seriesLike.count({ where: { seriesId } }),
        this.prisma.comment.count({
          where: { seriesId, deletedAt: null },
        }),
        this.prisma.shareEvent.count({ where: { seriesId } }),
        this.prisma.watchlistEntry.count({ where: { seriesId } }),
        accountId
          ? this.prisma.seriesLike.findUnique({
              where: {
                accountId_seriesId: { accountId, seriesId },
              },
              select: { id: true },
            })
          : Promise.resolve(null),
        accountId
          ? this.prisma.watchlistEntry.findUnique({
              where: {
                accountId_seriesId: { accountId, seriesId },
              },
              select: { id: true },
            })
          : Promise.resolve(null),
      ])

    return {
      series_id: seriesId,
      like_count: likeCount,
      comment_count: commentCount,
      share_count: shareCount,
      save_count: saveCount,
      liked_by_me: !!liked,
      saved_by_me: !!saved,
    }
  }

  async getLikeStatus(
    accountId: string,
    seriesId: string
  ): Promise<SeriesLikeStatusResponse> {
    await this.assertSeriesEngageable(seriesId)

    const [liked, likeCount] = await Promise.all([
      this.prisma.seriesLike.findUnique({
        where: {
          accountId_seriesId: { accountId, seriesId },
        },
        select: { id: true },
      }),
      this.prisma.seriesLike.count({ where: { seriesId } }),
    ])

    return {
      liked: !!liked,
      like_count: likeCount,
    }
  }

  async likeSeries(accountId: string, seriesId: string): Promise<void> {
    await this.assertSeriesEngageable(seriesId)

    await this.prisma.seriesLike.upsert({
      where: {
        accountId_seriesId: { accountId, seriesId },
      },
      create: { accountId, seriesId },
      update: {},
    })
  }

  async unlikeSeries(accountId: string, seriesId: string): Promise<void> {
    const entry = await this.prisma.seriesLike.findUnique({
      where: {
        accountId_seriesId: { accountId, seriesId },
      },
      select: { id: true },
    })

    if (!entry) {
      throw new NotFoundException("Like not found")
    }

    await this.prisma.seriesLike.delete({ where: { id: entry.id } })
  }

  async listComments(
    seriesId: string,
    options: {
      accountId?: string
      parentId?: string
      cursor?: string
    }
  ): Promise<SeriesCommentsListResponse> {
    await this.assertSeriesEngageable(seriesId)

    const parentId = options.parentId ?? null
    const take = parentId ? REPLY_PAGE_SIZE : COMMENT_PAGE_SIZE

    const comments = await this.prisma.comment.findMany({
      where: {
        seriesId,
        parentId,
        ...(options.cursor
          ? { createdAt: { lt: new Date(options.cursor) } }
          : {}),
      },
      include: this.commentInclude(options.accountId),
      orderBy: parentId
        ? { createdAt: "asc" }
        : [{ pinnedAt: "desc" }, { createdAt: "desc" }],
      take: take + 1,
    })

    const hasMore = comments.length > take
    const page = hasMore ? comments.slice(0, take) : comments

    const items = page.map((comment) =>
      this.toComment(comment, options.accountId)
    )

    if (!parentId && page.length > 0) {
      const nested = await this.loadNestedReplies(
        seriesId,
        page.map((c) => c.id),
        options.accountId
      )
      for (const item of items) {
        const replies = nested.get(item.id) ?? []
        item.replies = replies
        item.reply_count = replies.length
      }
    }

    return {
      items,
      total: items.length,
      next_cursor: hasMore
        ? (page[page.length - 1]?.createdAt.toISOString() ?? null)
        : null,
    }
  }

  /**
   * Flatten replies under each root into one visual level.
   * Supports reply-to-reply (depth 2) by resolving the root via parent.parentId.
   */
  private async loadNestedReplies(
    seriesId: string,
    rootIds: string[],
    accountId?: string
  ): Promise<Map<string, SeriesComment[]>> {
    const byRoot = new Map<string, SeriesComment[]>()
    for (const rootId of rootIds) {
      byRoot.set(rootId, [])
    }
    if (rootIds.length === 0) return byRoot

    const all = await this.prisma.comment.findMany({
      where: {
        seriesId,
        OR: [
          { parentId: { in: rootIds } },
          { parent: { parentId: { in: rootIds } } },
        ],
      },
      include: this.commentInclude(accountId),
      orderBy: { createdAt: "asc" },
    })

    for (const comment of all) {
      const rootId =
        comment.parentId && rootIds.includes(comment.parentId)
          ? comment.parentId
          : comment.parent?.parentId &&
              rootIds.includes(comment.parent.parentId)
            ? comment.parent.parentId
            : null

      if (!rootId) continue

      byRoot.get(rootId)?.push(
        this.toComment(comment, accountId, {
          parent_id: rootId,
          reply_count: 0,
        })
      )
    }

    return byRoot
  }

  async createComment(
    accountId: string,
    seriesId: string,
    dto: CreateSeriesCommentRequest
  ): Promise<SeriesComment> {
    await this.assertCommentsEnabled(seriesId)

    const body = dto.body.trim()
    if (!body) {
      throw new BadRequestException("Comment body is required")
    }
    if (body.length > 2000) {
      throw new BadRequestException("Comment is too long")
    }

    let parentId: string | null = dto.parent_id ?? null

    if (parentId) {
      const parent = await this.prisma.comment.findFirst({
        where: {
          id: parentId,
          seriesId,
          deletedAt: null,
        },
        select: {
          id: true,
          parentId: true,
          parent: { select: { parentId: true } },
        },
      })

      if (!parent) {
        throw new NotFoundException("Parent comment not found")
      }

      // Cap nesting at reply-to-reply (depth 2).
      if (parent.parentId && parent.parent?.parentId) {
        throw new BadRequestException("Cannot nest replies further")
      }
    }

    const created = await this.prisma.comment.create({
      data: {
        seriesId,
        accountId,
        parentId,
        body,
      },
      include: this.commentInclude(accountId),
    })

    return this.toComment(created, accountId)
  }

  async deleteComment(accountId: string, commentId: string): Promise<void> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, accountId: true, deletedAt: true },
    })

    if (!comment || comment.deletedAt) {
      throw new NotFoundException("Comment not found")
    }

    if (comment.accountId !== accountId) {
      throw new ForbiddenException("You can only delete your own comments")
    }

    await this.prisma.comment.update({
      where: { id: commentId },
      data: { deletedAt: new Date(), body: "" },
    })
  }

  async likeComment(accountId: string, commentId: string): Promise<void> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        seriesId: true,
        deletedAt: true,
      },
    })

    if (!comment || comment.deletedAt) {
      throw new NotFoundException("Comment not found")
    }

    await this.assertCommentsEnabled(comment.seriesId)

    await this.prisma.commentLike.upsert({
      where: {
        accountId_commentId: { accountId, commentId },
      },
      create: { accountId, commentId },
      update: {},
    })
  }

  async unlikeComment(accountId: string, commentId: string): Promise<void> {
    const entry = await this.prisma.commentLike.findUnique({
      where: {
        accountId_commentId: { accountId, commentId },
      },
      select: { id: true },
    })

    if (!entry) {
      throw new NotFoundException("Like not found")
    }

    await this.prisma.commentLike.delete({ where: { id: entry.id } })
  }

  async recordShare(
    seriesId: string,
    dto: RecordShareRequest,
    accountId?: string
  ): Promise<void> {
    await this.assertSeriesEngageable(seriesId)

    await this.prisma.shareEvent.create({
      data: {
        seriesId,
        accountId: accountId ?? null,
        channel: dto.channel,
      },
    })
  }
}
