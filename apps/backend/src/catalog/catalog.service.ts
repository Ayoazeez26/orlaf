import { BadRequestException, Injectable, Logger } from "@nestjs/common"
import type {
  CatalogCollectionKey,
  CatalogCollectionResponse,
  CatalogCollectionSeries,
  CatalogFeedItem,
  SeriesType,
} from "@sable/contracts"
import { Prisma } from "../generated/prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import {
  mapManySeriesGenres,
  seriesGenresInclude,
} from "../studio/studio-genre.util"

const FEED_LIMIT = 40
const COLLECTION_LIMIT = 40
const RECENCY_WINDOW_DAYS = 14
const VIEW_WINDOW_DAYS = 30
const TRENDING_VIEW_DAYS = 7
const NEW_WINDOW_DAYS = 30

const COLLECTION_KEYS: CatalogCollectionKey[] = [
  "featured",
  "trending",
  "new",
  "popular",
  "old-nollywood",
  "ai-films",
  "sable-originals",
]

const COLLECTION_META: Record<
  CatalogCollectionKey,
  { title: string; description: string }
> = {
  featured: {
    title: "Featured",
    description: "Top series by engagement and recency",
  },
  trending: {
    title: "Trending",
    description: "Rising series from the last 7 days",
  },
  new: {
    title: "New",
    description: "Recently published series",
  },
  popular: {
    title: "Popular",
    description: "Most watched over the last 30 days",
  },
  "old-nollywood": {
    title: "Old Nollywood",
    description: "Classic Nollywood titles",
  },
  "ai-films": {
    title: "AI Films",
    description: "AI-produced films and shorts",
  },
  "sable-originals": {
    title: "Sable Originals",
    description: "Exclusive Sable originals",
  },
}

/** Editorial tags creators/admins should attach for collection membership. */
const COLLECTION_TAGS: Partial<Record<CatalogCollectionKey, string[]>> = {
  "old-nollywood": ["old-nollywood", "nollywood"],
  "ai-films": ["ai-films", "ai"],
  "sable-originals": ["sable-originals", "sable-original"],
}

type EngagementWindows = {
  viewDays: number
  weightRecency: boolean
  limit: number
}

type SeriesCardRow = {
  id: string
  title: string
  synopsis: string | null
  type: SeriesType
  tags: string[]
  posterUrl: string | null
  publishedAt: Date | null
  createdAt: Date
  creator: {
    displayName: string | null
    creatorProfile: { studioName: string | null } | null
  }
  _count: { episodes: number }
  seriesGenres: Array<{ genre: { name: string; sortOrder: number } }>
}

/**
 * For You / catalog feed ranking + home tab collections.
 *
 * Factors used TODAY (v1):
 * - Eligible inventory: published + public series
 * - Feed: ready free episode with HLS; one episode per series
 * - Engagement: views (windowed), likes, shares, comments
 * - Recency boost for featured / feed
 * - Editorial collections: Series.tags membership
 */
@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name)

  constructor(private readonly prisma: PrismaService) {}

  async getFeed(): Promise<CatalogFeedItem[]> {
    const candidates = await this.prisma.series.findMany({
      where: {
        status: "published",
        isPublic: true,
        archivedAt: null,
      },
      select: {
        id: true,
        title: true,
        publishedAt: true,
        createdAt: true,
        creator: {
          select: {
            displayName: true,
            creatorProfile: { select: { studioName: true } },
          },
        },
        episodes: {
          where: {
            status: "ready",
            archivedAt: null,
            accessType: "free",
            hlsUrl: { not: null },
          },
          orderBy: { order: "asc" },
          take: 1,
          select: {
            id: true,
            title: true,
            synopsis: true,
            thumbnailUrl: true,
            hlsUrl: true,
            durationSeconds: true,
            accessType: true,
          },
        },
      },
    })

    const playable = candidates.filter((series) => series.episodes[0]?.hlsUrl)

    if (playable.length === 0) return []

    const seriesIds = playable.map((series) => series.id)
    const metrics = await this.loadEngagementMetrics(
      seriesIds,
      VIEW_WINDOW_DAYS
    )

    const scored = playable.map((series) => {
      const episode = series.episodes[0]!
      const views = metrics.views.get(series.id) ?? 0
      const likes = metrics.likes.get(series.id) ?? 0
      const shares = metrics.shares.get(series.id) ?? 0
      const comments = metrics.comments.get(series.id) ?? 0
      const publishedAt = series.publishedAt ?? series.createdAt
      const score = this.engagementScore({
        views,
        likes,
        shares,
        comments,
        publishedAt,
        weightRecency: true,
      })

      const item: CatalogFeedItem & { _score: number } = {
        id: episode.id,
        seriesId: series.id,
        seriesTitle: series.title,
        title: episode.title,
        synopsis: episode.synopsis,
        thumbnailUrl: episode.thumbnailUrl,
        hlsUrl: episode.hlsUrl!,
        durationSeconds: episode.durationSeconds,
        accessType: episode.accessType,
        creatorName: this.creatorName(series.creator),
        _score: score,
      }
      return item
    })

    scored.sort((a, b) => b._score - a._score)

    const feed = scored.slice(0, FEED_LIMIT).map(({ _score, ...item }) => item)

    this.logger.debug({
      event: "catalog_feed_built",
      candidates: playable.length,
      returned: feed.length,
    })

    return feed
  }

  async getCollection(
    key: string,
    limit = COLLECTION_LIMIT
  ): Promise<CatalogCollectionResponse> {
    if (!this.isCollectionKey(key)) {
      throw new BadRequestException(
        `Unknown collection. Expected one of: ${COLLECTION_KEYS.join(", ")}`
      )
    }

    const take = Math.min(Math.max(limit, 1), 100)
    const meta = COLLECTION_META[key]

    let items: CatalogCollectionSeries[]

    switch (key) {
      case "new":
        items = await this.listNew(take)
        break
      case "trending":
        items = await this.listByEngagement({
          viewDays: TRENDING_VIEW_DAYS,
          weightRecency: true,
          limit: take,
        })
        break
      case "popular":
        items = await this.listByEngagement({
          viewDays: VIEW_WINDOW_DAYS,
          weightRecency: false,
          limit: take,
        })
        break
      case "featured":
        items = await this.listByEngagement({
          viewDays: VIEW_WINDOW_DAYS,
          weightRecency: true,
          limit: take,
        })
        break
      case "old-nollywood":
      case "ai-films":
      case "sable-originals":
        items = await this.listByTags(COLLECTION_TAGS[key]!, take)
        break
    }

    return {
      key,
      title: meta.title,
      description: meta.description,
      items,
    }
  }

  private isCollectionKey(value: string): value is CatalogCollectionKey {
    return (COLLECTION_KEYS as readonly string[]).includes(value)
  }

  private async listNew(limit: number): Promise<CatalogCollectionSeries[]> {
    const since = new Date(
      Date.now() - NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000
    )

    const rows = await this.prisma.series.findMany({
      where: {
        ...this.publicSeriesWhere(),
        publishedAt: { gte: since },
      },
      include: this.seriesCardInclude(),
      orderBy: { publishedAt: "desc" },
      take: limit,
    })

    return this.mapSeriesCards(rows as SeriesCardRow[], null)
  }

  private async listByTags(
    tags: string[],
    limit: number
  ): Promise<CatalogCollectionSeries[]> {
    const rows = await this.prisma.series.findMany({
      where: {
        ...this.publicSeriesWhere(),
        tags: { hasSome: tags },
      },
      include: this.seriesCardInclude(),
      orderBy: { publishedAt: "desc" },
      take: limit,
    })

    return this.mapSeriesCards(rows as SeriesCardRow[], null)
  }

  private async listByEngagement(
    options: EngagementWindows
  ): Promise<CatalogCollectionSeries[]> {
    const rows = await this.prisma.series.findMany({
      where: this.publicSeriesWhere(),
      include: this.seriesCardInclude(),
    })

    if (rows.length === 0) return []

    const typed = rows as SeriesCardRow[]
    const metrics = await this.loadEngagementMetrics(
      typed.map((row) => row.id),
      options.viewDays
    )

    const scored = typed.map((row) => {
      const views = metrics.views.get(row.id) ?? 0
      const likes = metrics.likes.get(row.id) ?? 0
      const shares = metrics.shares.get(row.id) ?? 0
      const comments = metrics.comments.get(row.id) ?? 0
      const publishedAt = row.publishedAt ?? row.createdAt
      const score = this.engagementScore({
        views,
        likes,
        shares,
        comments,
        publishedAt,
        weightRecency: options.weightRecency,
      })

      return { row, views, score }
    })

    scored.sort((a, b) => b.score - a.score || b.views - a.views)

    const top = scored.slice(0, options.limit)
    const viewsMap = new Map(top.map((entry) => [entry.row.id, entry.views]))

    return this.mapSeriesCards(
      top.map((entry) => entry.row),
      viewsMap
    )
  }

  private publicSeriesWhere(): Prisma.SeriesWhereInput {
    return {
      status: "published",
      isPublic: true,
      archivedAt: null,
    }
  }

  private seriesCardInclude() {
    return {
      _count: { select: { episodes: true } },
      creator: {
        select: {
          displayName: true,
          creatorProfile: { select: { studioName: true } },
        },
      },
      ...seriesGenresInclude,
    } as const
  }

  private mapSeriesCards(
    rows: SeriesCardRow[],
    viewsBySeries: Map<string, number> | null
  ): CatalogCollectionSeries[] {
    return mapManySeriesGenres(rows).map((row) => ({
      id: row.id,
      title: row.title,
      synopsis: row.synopsis,
      type: row.type,
      genres: row.genres,
      tags: row.tags,
      posterUrl: row.posterUrl,
      publishedAt: row.publishedAt?.toISOString() ?? null,
      episodeCount: row._count.episodes,
      creatorName: this.creatorName(row.creator),
      viewCount: viewsBySeries?.get(row.id) ?? null,
    }))
  }

  private creatorName(creator: SeriesCardRow["creator"]): string | null {
    return (
      creator.creatorProfile?.studioName?.trim() ||
      creator.displayName?.trim() ||
      null
    )
  }

  private engagementScore(input: {
    views: number
    likes: number
    shares: number
    comments: number
    publishedAt: Date
    weightRecency: boolean
  }): number {
    const ageDays =
      (Date.now() - input.publishedAt.getTime()) / (24 * 60 * 60 * 1000)
    const recencyBoost = input.weightRecency
      ? Math.max(0, RECENCY_WINDOW_DAYS - ageDays) * 10
      : 0

    return (
      input.views * 1 +
      input.likes * 3 +
      input.shares * 5 +
      input.comments * 2 +
      recencyBoost
    )
  }

  private async loadEngagementMetrics(seriesIds: string[], viewDays: number) {
    const since = new Date(Date.now() - viewDays * 24 * 60 * 60 * 1000)

    const [viewRows, likeRows, shareRows, commentRows] = await Promise.all([
      this.prisma.playbackSession.groupBy({
        by: ["seriesId"],
        where: {
          seriesId: { in: seriesIds },
          countedAsView: true,
          startedAt: { gte: since },
        },
        _count: { _all: true },
      }),
      this.prisma.seriesLike.groupBy({
        by: ["seriesId"],
        where: { seriesId: { in: seriesIds } },
        _count: { _all: true },
      }),
      this.prisma.shareEvent.groupBy({
        by: ["seriesId"],
        where: { seriesId: { in: seriesIds } },
        _count: { _all: true },
      }),
      this.prisma.comment.groupBy({
        by: ["seriesId"],
        where: {
          seriesId: { in: seriesIds },
          deletedAt: null,
        },
        _count: { _all: true },
      }),
    ])

    return {
      views: new Map(viewRows.map((row) => [row.seriesId, row._count._all])),
      likes: new Map(likeRows.map((row) => [row.seriesId, row._count._all])),
      shares: new Map(shareRows.map((row) => [row.seriesId, row._count._all])),
      comments: new Map(
        commentRows.map((row) => [row.seriesId, row._count._all])
      ),
    }
  }
}
