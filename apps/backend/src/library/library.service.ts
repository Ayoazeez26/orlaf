import { Injectable, NotFoundException } from "@nestjs/common"
import type {
  CreateDownloadsRequest,
  DownloadListResponse,
  DownloadQualityKey,
  DownloadTargetKey,
  WatchlistListResponse,
  WatchlistStatusResponse,
} from "@sable/contracts"
import { PrismaService } from "../prisma/prisma.service"
import {
  estimateBytesForQuality,
  mapDownloadEntry,
  mapWatchlistEntry,
} from "./library.mapper"

const SAVEABLE_SERIES_STATUSES = ["published"] as const

const QUALITY_MAP: Record<
  DownloadQualityKey,
  "standard" | "high" | "full_hd"
> = {
  standard: "standard",
  high: "high",
  full_hd: "full_hd",
}

@Injectable()
export class LibraryService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertSeriesSaveable(seriesId: string) {
    const series = await this.prisma.series.findUnique({
      where: { id: seriesId },
      select: { id: true, status: true, isPublic: true, archivedAt: true },
    })

    if (
      !series ||
      !SAVEABLE_SERIES_STATUSES.includes(
        series.status as (typeof SAVEABLE_SERIES_STATUSES)[number]
      ) ||
      !series.isPublic ||
      series.archivedAt
    ) {
      throw new NotFoundException("Series not found")
    }

    return series
  }

  async listWatchlist(accountId: string): Promise<WatchlistListResponse> {
    const entries = await this.prisma.watchlistEntry.findMany({
      where: {
        accountId,
        series: {
          status: { in: [...SAVEABLE_SERIES_STATUSES] },
          isPublic: true,
          archivedAt: null,
        },
      },
      include: {
        series: {
          include: {
            _count: { select: { episodes: true } },
          },
        },
      },
      orderBy: { savedAt: "desc" },
    })

    const items = entries.map(mapWatchlistEntry)

    return {
      items,
      total: items.length,
    }
  }

  async addToWatchlist(accountId: string, seriesId: string): Promise<void> {
    await this.assertSeriesSaveable(seriesId)

    await this.prisma.watchlistEntry.upsert({
      where: {
        accountId_seriesId: { accountId, seriesId },
      },
      create: { accountId, seriesId },
      update: {},
    })
  }

  async removeFromWatchlist(
    accountId: string,
    seriesId: string
  ): Promise<void> {
    const entry = await this.prisma.watchlistEntry.findUnique({
      where: {
        accountId_seriesId: { accountId, seriesId },
      },
      select: { id: true },
    })

    if (!entry) {
      throw new NotFoundException("Watchlist item not found")
    }

    await this.prisma.watchlistEntry.delete({
      where: { id: entry.id },
    })
  }

  async clearWatchlist(accountId: string): Promise<void> {
    await this.prisma.watchlistEntry.deleteMany({
      where: { accountId },
    })
  }

  async getWatchlistStatus(
    accountId: string,
    seriesId: string
  ): Promise<WatchlistStatusResponse> {
    const entry = await this.prisma.watchlistEntry.findUnique({
      where: {
        accountId_seriesId: { accountId, seriesId },
      },
      select: { id: true },
    })

    return { saved: !!entry }
  }

  // ---------------------------------------------------------------------------
  // Downloads
  // ---------------------------------------------------------------------------

  async listDownloads(accountId: string): Promise<DownloadListResponse> {
    const entries = await this.prisma.downloadEntry.findMany({
      where: { accountId },
      include: {
        series: { select: { title: true, posterUrl: true } },
        episode: { select: { title: true, order: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const items = entries.map((entry) =>
      mapDownloadEntry({
        ...entry,
        quality: entry.quality as DownloadQualityKey,
        status: entry.status,
      })
    )

    return { items, total: items.length }
  }

  async createDownloads(
    accountId: string,
    body: CreateDownloadsRequest
  ): Promise<DownloadListResponse> {
    await this.assertSeriesSaveable(body.seriesId)

    const episodes = await this.resolveDownloadEpisodes(
      body.seriesId,
      body.target,
      body.currentEpisodeId
    )

    if (episodes.length === 0) {
      throw new NotFoundException("No downloadable episodes found")
    }

    const quality = QUALITY_MAP[body.quality]
    const now = new Date()

    await this.prisma.$transaction(
      episodes.map((episode) => {
        const estimated = estimateBytesForQuality(
          episode.durationSeconds,
          body.quality
        )
        return this.prisma.downloadEntry.upsert({
          where: {
            accountId_episodeId_quality: {
              accountId,
              episodeId: episode.id,
              quality,
            },
          },
          create: {
            accountId,
            seriesId: body.seriesId,
            episodeId: episode.id,
            quality,
            // Tracked as ready for library until real offline packs exist.
            status: "ready",
            progress: 100,
            estimatedBytes:
              estimated != null ? BigInt(estimated) : episode.fileSizeBytes,
            completedAt: now,
          },
          update: {
            status: "ready",
            progress: 100,
            estimatedBytes:
              estimated != null ? BigInt(estimated) : episode.fileSizeBytes,
            completedAt: now,
          },
        })
      })
    )

    return this.listDownloads(accountId)
  }

  async removeDownload(accountId: string, downloadId: string): Promise<void> {
    const entry = await this.prisma.downloadEntry.findFirst({
      where: { id: downloadId, accountId },
      select: { id: true },
    })

    if (!entry) {
      throw new NotFoundException("Download not found")
    }

    await this.prisma.downloadEntry.delete({ where: { id: entry.id } })
  }

  async clearDownloads(accountId: string): Promise<void> {
    await this.prisma.downloadEntry.deleteMany({ where: { accountId } })
  }

  private async resolveDownloadEpisodes(
    seriesId: string,
    target: DownloadTargetKey,
    currentEpisodeId?: string
  ) {
    const episodes = await this.prisma.episode.findMany({
      where: {
        seriesId,
        archivedAt: null,
        status: "ready",
        OR: [{ hlsUrl: { not: null } }, { dashUrl: { not: null } }],
      },
      orderBy: [{ season: "asc" }, { order: "asc" }],
      select: {
        id: true,
        order: true,
        durationSeconds: true,
        fileSizeBytes: true,
      },
    })

    if (episodes.length === 0) return []

    if (target === "all") return episodes

    if (target === "select") {
      // Episode picker UI not wired yet — fall back to current episode.
      if (!currentEpisodeId) return episodes.slice(0, 1)
      const current = episodes.find((ep) => ep.id === currentEpisodeId)
      return current ? [current] : episodes.slice(0, 1)
    }

    if (!currentEpisodeId) {
      return episodes.slice(0, 1)
    }

    const index = episodes.findIndex((ep) => ep.id === currentEpisodeId)
    if (index < 0) return episodes.slice(0, 1)

    if (target === "current") return [episodes[index]!]

    // next
    return [episodes[Math.min(index + 1, episodes.length - 1)]!]
  }
}
