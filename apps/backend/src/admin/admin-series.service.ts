import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common"
import type {
  AdminSeriesDetail,
  AdminSeriesEpisode,
  AdminSeriesListItem,
  AdminSeriesListQuery,
  AdminSeriesListResponse,
  AdminSeriesPublishStatus,
  AdminSeriesReviewStatus,
  AdminSeriesStats,
} from "@sable/contracts"
import type { Prisma, SeriesStatus } from "src/generated/prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import type { AdminSeriesActionDto } from "./dto/admin-series.dto"

const SERIES_INCLUDE = {
  creator: {
    select: {
      id: true,
      email: true,
      displayName: true,
      firstName: true,
      lastName: true,
      creatorProfile: {
        select: {
          handle: true,
        },
      },
    },
  },
  seriesGenres: {
    include: {
      genre: {
        select: { name: true },
      },
    },
  },
  episodes: {
    orderBy: { order: "asc" as const },
    select: {
      id: true,
      order: true,
      title: true,
      durationSeconds: true,
      fileSizeBytes: true,
      status: true,
    },
  },
  _count: {
    select: { episodes: true },
  },
} satisfies Prisma.SeriesInclude

type SeriesRow = Prisma.SeriesGetPayload<{ include: typeof SERIES_INCLUDE }>

const PUBLISHABLE_STATUSES: SeriesStatus[] = ["draft", "in_review", "rejected"]

const REJECTABLE_STATUSES: SeriesStatus[] = ["draft", "in_review", "published"]

@Injectable()
export class AdminSeriesService {
  private readonly logger = new Logger(AdminSeriesService.name)

  constructor(private readonly prisma: PrismaService) {}

  async list(query: AdminSeriesListQuery): Promise<AdminSeriesListResponse> {
    const page = Math.max(1, query.page ?? 1)
    const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 20))
    const filter = query.filter ?? "all"
    const q = query.q?.trim()

    const where: Prisma.SeriesWhereInput = {
      status: { not: "archived" },
    }

    if (filter === "pending-review") {
      where.status = "in_review"
    } else if (filter === "rejected") {
      where.status = "rejected"
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        {
          creator: {
            displayName: { contains: q, mode: "insensitive" },
          },
        },
        {
          creator: {
            firstName: { contains: q, mode: "insensitive" },
          },
        },
        {
          creator: {
            lastName: { contains: q, mode: "insensitive" },
          },
        },
        {
          creator: {
            email: { contains: q, mode: "insensitive" },
          },
        },
      ]
    }

    const [rows, total, stats] = await Promise.all([
      this.prisma.series.findMany({
        where,
        include: {
          creator: {
            select: {
              displayName: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          seriesGenres: {
            include: { genre: { select: { name: true } } },
          },
          _count: { select: { episodes: true } },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.series.count({ where }),
      this.computeStats(),
    ])

    return {
      items: rows.map((row) => this.toListItem(row)),
      total,
      page,
      pageSize,
      stats,
    }
  }

  async getById(id: string): Promise<AdminSeriesDetail> {
    const row = await this.prisma.series.findUnique({
      where: { id },
      include: SERIES_INCLUDE,
    })

    if (!row) {
      throw new NotFoundException("Series not found")
    }

    return this.toDetail(row)
  }

  async publish(
    id: string,
    adminId: string,
    input: AdminSeriesActionDto = {}
  ): Promise<AdminSeriesDetail> {
    const series = await this.getSeriesOrThrow(id)

    if (!PUBLISHABLE_STATUSES.includes(series.status)) {
      throw new BadRequestException(
        `Cannot approve series with status "${series.status}"`
      )
    }

    const updated = await this.prisma.series.update({
      where: { id },
      data: {
        status: "published",
        publishedAt: series.publishedAt ?? new Date(),
        adminActionById: adminId,
        adminActionAt: new Date(),
        adminActionNote: input.note?.trim() || null,
      },
      include: SERIES_INCLUDE,
    })

    this.logger.log({
      event: "admin_series_published",
      series_id: id,
      admin_id: adminId,
    })

    return this.toDetail(updated)
  }

  async reject(
    id: string,
    adminId: string,
    input: AdminSeriesActionDto = {}
  ): Promise<AdminSeriesDetail> {
    const series = await this.getSeriesOrThrow(id)

    if (!REJECTABLE_STATUSES.includes(series.status)) {
      throw new BadRequestException(
        `Cannot reject series with status "${series.status}"`
      )
    }

    const updated = await this.prisma.series.update({
      where: { id },
      data: {
        status: "rejected",
        adminActionById: adminId,
        adminActionAt: new Date(),
        adminActionNote: input.note?.trim() || null,
      },
      include: SERIES_INCLUDE,
    })

    this.logger.log({
      event: "admin_series_rejected",
      series_id: id,
      admin_id: adminId,
    })

    return this.toDetail(updated)
  }

  async unpublish(
    id: string,
    adminId: string,
    input: AdminSeriesActionDto = {}
  ): Promise<AdminSeriesDetail> {
    const series = await this.getSeriesOrThrow(id)

    if (series.status !== "published") {
      throw new BadRequestException("Only published series can be unpublished")
    }

    const updated = await this.prisma.series.update({
      where: { id },
      data: {
        status: "draft",
        adminActionById: adminId,
        adminActionAt: new Date(),
        adminActionNote: input.note?.trim() || null,
      },
      include: SERIES_INCLUDE,
    })

    this.logger.log({
      event: "admin_series_unpublished",
      series_id: id,
      admin_id: adminId,
    })

    return this.toDetail(updated)
  }

  async remove(id: string, adminId: string): Promise<void> {
    await this.getSeriesOrThrow(id)
    await this.prisma.series.delete({ where: { id } })

    this.logger.log({
      event: "admin_series_deleted",
      series_id: id,
      admin_id: adminId,
    })
  }

  private async getSeriesOrThrow(id: string) {
    const series = await this.prisma.series.findUnique({
      where: { id },
      select: { id: true, status: true, publishedAt: true },
    })

    if (!series) {
      throw new NotFoundException("Series not found")
    }

    return series
  }

  private async computeStats(): Promise<AdminSeriesStats> {
    const base: Prisma.SeriesWhereInput = { status: { not: "archived" } }

    const [total, pendingReview, rejected, approved] = await Promise.all([
      this.prisma.series.count({ where: base }),
      this.prisma.series.count({
        where: { ...base, status: "in_review" },
      }),
      this.prisma.series.count({
        where: { ...base, status: "rejected" },
      }),
      this.prisma.series.count({
        where: {
          ...base,
          status: { notIn: ["in_review", "rejected"] },
        },
      }),
    ])

    return { total, pendingReview, approved, rejected }
  }

  private toListItem(
    row: Prisma.SeriesGetPayload<{
      include: {
        creator: {
          select: {
            displayName: true
            firstName: true
            lastName: true
            email: true
          }
        }
        seriesGenres: { include: { genre: { select: { name: true } } } }
        _count: { select: { episodes: true } }
      }
    }>
  ): AdminSeriesListItem {
    const { reviewStatus, publishStatus } = mapSeriesStatusToUi(row.status)

    return {
      id: row.id,
      title: row.title,
      genre: formatGenres(row.seriesGenres),
      language: row.language,
      creatorName: formatCreatorName(row.creator),
      episodeCount: row._count.episodes,
      views: null,
      status: row.status,
      reviewStatus,
      publishStatus,
      posterUrl: row.posterUrl,
      createdAt: row.createdAt.toISOString(),
    }
  }

  private toDetail(row: SeriesRow): AdminSeriesDetail {
    const list = this.toListItem(row)
    const handle = row.creator.creatorProfile?.handle

    return {
      ...list,
      synopsis: row.synopsis,
      creatorId: row.creator.id,
      creatorEmail: row.creator.email,
      creatorUsername: handle ? `@${handle}` : row.creator.email,
      creatorInitials: initialsFromName(list.creatorName),
      publishedAt: row.publishedAt?.toISOString() ?? null,
      adminActionNote: row.adminActionNote,
      episodes: row.episodes.map((episode) =>
        this.toEpisode(episode, row.status)
      ),
    }
  }

  private toEpisode(
    episode: SeriesRow["episodes"][number],
    seriesStatus: SeriesStatus
  ): AdminSeriesEpisode {
    return {
      id: episode.id,
      number: episode.order,
      title: episode.title,
      duration: formatDuration(episode.durationSeconds),
      size: formatFileSize(episode.fileSizeBytes),
      views: null,
      status: mapEpisodeUiStatus(episode.status, seriesStatus),
    }
  }
}

function mapSeriesStatusToUi(status: SeriesStatus): {
  reviewStatus: AdminSeriesReviewStatus
  publishStatus: AdminSeriesPublishStatus
} {
  switch (status) {
    case "published":
      return { reviewStatus: "approved", publishStatus: "published" }
    case "in_review":
      return { reviewStatus: "pending", publishStatus: "draft" }
    case "rejected":
      return { reviewStatus: "rejected", publishStatus: "draft" }
    default:
      return { reviewStatus: "approved", publishStatus: "draft" }
  }
}

function mapEpisodeUiStatus(
  status: SeriesRow["episodes"][number]["status"],
  seriesStatus: SeriesStatus
): AdminSeriesEpisode["status"] {
  if (status === "failed") return "failed"
  if (
    status === "processing" ||
    status === "uploading" ||
    status === "pending"
  ) {
    return "processing"
  }
  if (seriesStatus === "published") return "published"
  return "draft"
}

function formatGenres(seriesGenres: { genre: { name: string } }[]): string {
  const names = seriesGenres.map((entry) => entry.genre.name)
  return names.length > 0 ? names.join(" / ") : "—"
}

function formatCreatorName(creator: {
  displayName: string | null
  firstName: string | null
  lastName: string | null
  email: string
}): string {
  if (creator.displayName?.trim()) return creator.displayName.trim()
  const full = `${creator.firstName ?? ""} ${creator.lastName ?? ""}`.trim()
  return full || creator.email
}

function initialsFromName(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase()
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
}

function formatDuration(seconds: number | null): string {
  if (seconds == null || !Number.isFinite(seconds)) return "—"
  const total = Math.max(0, Math.round(seconds))
  const minutes = Math.floor(total / 60)
  const remainder = total % 60
  return `${minutes}:${String(remainder).padStart(2, "0")}`
}

function formatFileSize(bytes: bigint | null): string {
  if (bytes == null) return "—"
  const value = Number(bytes)
  if (!Number.isFinite(value) || value <= 0) return "—"
  const mb = value / (1024 * 1024)
  return `${mb.toFixed(1)} MB`
}
