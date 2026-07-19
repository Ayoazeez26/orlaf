import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import type {
  ArchivedItem,
  ArchiveItemType,
  ArchiveListResponse,
} from "@sable/contracts"
import { CustomLogger } from "@sable/logger"
import { PrismaService } from "../prisma/prisma.service"
import { EpisodeService } from "../studio/episode.service"
import { SeriesService } from "../studio/series.service"

type ArchiveFilter = ArchiveItemType | "all"

@Injectable()
export class ArchiveService {
  private readonly logger = new CustomLogger(ArchiveService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly seriesService: SeriesService,
    private readonly episodeService: EpisodeService
  ) {}

  private assertCreator(accountType: string) {
    if (accountType !== "creator") {
      throw new ForbiddenException("Creators only")
    }
  }

  private parseItemRef(
    kind: string,
    id: string
  ): { kind: "series" | "episode"; id: string } {
    if ((kind !== "series" && kind !== "episode") || !id) {
      throw new BadRequestException("Invalid archive item type")
    }
    return { kind, id }
  }

  private sumEpisodeBytes(
    episodes: Array<{ fileSizeBytes: bigint | null }>
  ): number | null {
    let total = 0
    let hasSize = false

    for (const episode of episodes) {
      if (episode.fileSizeBytes != null) {
        total += Number(episode.fileSizeBytes)
        hasSize = true
      }
    }

    return hasSize ? total : null
  }

  private mapSeriesItem(series: {
    id: string
    title: string
    archivedAt: Date | null
    episodes: Array<{ fileSizeBytes: bigint | null }>
  }): ArchivedItem {
    return {
      id: `series:${series.id}`,
      entityId: series.id,
      type: "project",
      title: series.title,
      archivedAt: series.archivedAt?.toISOString(),
      sizeBytes: this.sumEpisodeBytes(series.episodes),
      icon: "folder",
    }
  }

  private mapEpisodeItem(episode: {
    id: string
    title: string
    archivedAt: Date | null
    fileSizeBytes: bigint | null
    series: { id: string; title: string }
  }): ArchivedItem {
    return {
      id: `episode:${episode.id}`,
      entityId: episode.id,
      type: "episode",
      title: episode.title,
      archivedAt: episode.archivedAt?.toISOString(),
      sizeBytes:
        episode.fileSizeBytes != null ? Number(episode.fileSizeBytes) : null,
      icon: "film",
      seriesId: episode.series.id,
      seriesTitle: episode.series.title,
    }
  }

  async listArchive(
    creatorId: string,
    accountType: string,
    filter: ArchiveFilter = "all"
  ): Promise<ArchiveListResponse> {
    this.assertCreator(accountType)

    const [archivedSeries, archivedEpisodes] = await Promise.all([
      this.prisma.series.findMany({
        where: { creatorId, status: "archived" },
        include: {
          episodes: { select: { fileSizeBytes: true } },
        },
        orderBy: { archivedAt: "desc" },
      }),
      this.prisma.episode.findMany({
        where: {
          archivedAt: { not: null },
          series: { creatorId, status: { not: "archived" } },
        },
        include: {
          series: { select: { id: true, title: true } },
        },
        orderBy: { archivedAt: "desc" },
      }),
    ])

    const projectItems = archivedSeries.map((series) =>
      this.mapSeriesItem(series)
    )
    const episodeItems = archivedEpisodes.map((episode) =>
      this.mapEpisodeItem(episode)
    )

    const counts = {
      all: projectItems.length + episodeItems.length,
      projects: projectItems.length,
      episodes: episodeItems.length,
      promotions: 0,
    }

    if (filter === "promotion") {
      return { items: [], counts }
    }

    let items: ArchivedItem[] = []
    if (filter === "all" || filter === "project") {
      items = items.concat(projectItems)
    }
    if (filter === "all" || filter === "episode") {
      items = items.concat(episodeItems)
    }

    items.sort(
      (a, b) =>
        new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime()
    )

    return { items, counts }
  }

  async restoreItem(
    creatorId: string,
    accountType: string,
    kind: string,
    id: string
  ): Promise<void> {
    this.assertCreator(accountType)

    const item = this.parseItemRef(kind, id)

    if (item.kind === "series") {
      await this.seriesService.restore(creatorId, item.id)
      return
    }

    const episode = await this.prisma.episode.findFirst({
      where: {
        id: item.id,
        archivedAt: { not: null },
        series: { creatorId },
      },
      select: { seriesId: true },
    })

    if (!episode) {
      throw new NotFoundException("Archived item not found")
    }

    await this.episodeService.restore(creatorId, episode.seriesId, item.id)
  }

  async deleteItem(
    creatorId: string,
    accountType: string,
    kind: string,
    id: string
  ): Promise<void> {
    this.assertCreator(accountType)

    const item = this.parseItemRef(kind, id)

    if (item.kind === "series") {
      const series = await this.prisma.series.findFirst({
        where: { id: item.id, creatorId, status: "archived" },
      })
      if (!series) throw new NotFoundException("Archived item not found")
      await this.seriesService.remove(creatorId, item.id)
      return
    }

    const episode = await this.prisma.episode.findFirst({
      where: {
        id: item.id,
        archivedAt: { not: null },
        series: { creatorId },
      },
      select: { seriesId: true },
    })

    if (!episode) {
      throw new NotFoundException("Archived item not found")
    }

    await this.episodeService.remove(creatorId, episode.seriesId, item.id)
  }

  async emptyArchive(creatorId: string, accountType: string): Promise<void> {
    this.assertCreator(accountType)

    const [archivedSeries, archivedEpisodes] = await Promise.all([
      this.prisma.series.findMany({
        where: { creatorId, status: "archived" },
        select: { id: true },
      }),
      this.prisma.episode.findMany({
        where: {
          archivedAt: { not: null },
          series: { creatorId, status: { not: "archived" } },
        },
        select: { id: true, seriesId: true },
      }),
    ])

    for (const series of archivedSeries) {
      await this.seriesService.remove(creatorId, series.id)
    }

    for (const episode of archivedEpisodes) {
      await this.episodeService.remove(creatorId, episode.seriesId, episode.id)
    }

    this.logger.log({
      event: "archive_emptied",
      creator_id: creatorId,
      series_count: archivedSeries.length,
      episode_count: archivedEpisodes.length,
    })
  }
}
