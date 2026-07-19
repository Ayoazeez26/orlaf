import { Injectable, NotFoundException } from "@nestjs/common"
import type {
  WatchlistListResponse,
  WatchlistStatusResponse,
} from "@sable/contracts"
import { PrismaService } from "../prisma/prisma.service"
import { mapWatchlistEntry } from "./library.mapper"

const SAVEABLE_SERIES_STATUSES = ["published"] as const

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
}
