import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import {
  IVideoHostingProvider,
  type PublicGenre,
  VIDEO_HOSTING_PROVIDER,
} from "@sable/contracts"
import { CustomLogger } from "@sable/logger"
import type { SeriesStatus } from "../generated/prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import {
  DEFAULT_CREATOR_PREFERENCES,
  visibilityToSeriesFields,
} from "../profile/preferences.constants"
import type {
  CreateSeriesDto,
  UpdateSeriesDto,
  UpdateSeriesSettingsDto,
} from "./dto/studio.dto"
import {
  mapManySeriesGenres,
  mapSeriesGenres,
  seriesGenresInclude,
} from "./studio-genre.util"

const MAX_SERIES_GENRES = 3

@Injectable()
export class SeriesService {
  private readonly logger = new CustomLogger(SeriesService.name)

  constructor(
    private readonly prisma: PrismaService,
    @Inject(VIDEO_HOSTING_PROVIDER)
    private readonly videoHosting: IVideoHostingProvider
  ) {}

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  async create(creatorId: string, dto: CreateSeriesDto) {
    const prefs = await this.getCreatorContentDefaults(creatorId)
    const visibility = visibilityToSeriesFields(prefs.defaultVisibility)
    const genreIds = await this.resolveGenreIds(dto.genres ?? [])

    const series = await this.prisma.series.create({
      data: {
        creatorId,
        title: dto.title,
        synopsis: dto.synopsis,
        type: dto.type ?? "short_series",
        language: dto.language ?? prefs.defaultContentLanguage,
        tags: dto.tags ?? [],
        subtitleLanguages: dto.subtitleLanguages ?? [],
        cast: (dto.cast ?? []) as any,
        crew: (dto.crew ?? []) as any,
        posterUrl: dto.posterUrl,
        trailerUrl: dto.trailerUrl,
        defaultAccessType: dto.defaultAccessType ?? "free",
        aiVerticalConversion: dto.aiVerticalConversion ?? true,
        autoReframeTo916: dto.autoReframeTo916 ?? true,
        autoCaptions: dto.autoCaptions ?? true,
        isPublic: visibility?.isPublic,
        listedInSearch: visibility?.listedInSearch,
        commentsEnabled: prefs.commentsEnabledByDefault,
        tippingEnabled: prefs.tippingEnabledByDefault,
        seriesGenres: {
          create: genreIds.map((genreId) => ({ genreId })),
        },
      },
      include: { episodes: true, ...seriesGenresInclude },
    })

    this.logger.log({
      event: "series_created",
      series_id: series.id,
      creator_id: creatorId,
    })

    return mapSeriesGenres(series)
  }

  async findAllPublic(
    filters: { q?: string; genres?: string[]; type?: string } = {}
  ) {
    const { q, genres, type } = filters

    return mapManySeriesGenres(
      await this.prisma.series.findMany({
        where: {
          status: "published",
          isPublic: true,
          ...(q && { listedInSearch: true }),
          ...(genres?.length && {
            seriesGenres: {
              some: { genre: { name: { in: genres } } },
            },
          }),
          ...(type && { type: type as any }),
          ...(q && {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { synopsis: { contains: q, mode: "insensitive" } },
            ],
          }),
        },
        include: {
          _count: { select: { episodes: true } },
          creator: {
            select: {
              displayName: true,
              avatarUrl: true,
              creatorProfile: {
                select: { studioName: true, handle: true, logoUrl: true },
              },
            },
          },
          ...seriesGenresInclude,
        },
        orderBy: { publishedAt: "desc" },
      })
    )
  }

  async findPublicGenres(): Promise<PublicGenre[]> {
    const [genres, counts] = await Promise.all([
      this.prisma.genre.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: { id: true, name: true },
      }),
      this.prisma.seriesGenre.groupBy({
        by: ["genreId"],
        where: {
          series: {
            status: "published",
            isPublic: true,
          },
        },
        _count: { genreId: true },
      }),
    ])

    const countByGenreId = new Map(
      counts.map((row) => [row.genreId, row._count.genreId])
    )

    return genres.map((genre) => ({
      id: genre.id,
      name: genre.name,
      seriesCount: countByGenreId.get(genre.id) ?? 0,
    }))
  }

  async findOnePublic(seriesId: string) {
    const series = await this.prisma.series.findUnique({
      where: { id: seriesId },
      include: {
        _count: { select: { episodes: true } },
        creator: {
          select: {
            displayName: true,
            avatarUrl: true,
            creatorProfile: {
              select: { studioName: true, handle: true, logoUrl: true },
            },
          },
        },
        episodes: {
          where: { status: "ready" },
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            synopsis: true,
            order: true,
            season: true,
            thumbnailUrl: true,
            durationSeconds: true,
            accessType: true,
            coinPrice: true,
          },
        },
        ...seriesGenresInclude,
      },
    })

    if (series?.status !== "published" || !series.isPublic) {
      throw new NotFoundException("Series not found")
    }

    return mapSeriesGenres(series)
  }

  async findOnePublicEpisode(seriesId: string, episodeId: string) {
    // Verify series is public first
    const series = await this.prisma.series.findUnique({
      where: { id: seriesId },
      select: { status: true, isPublic: true },
    })

    if (series?.status !== "published" || !series.isPublic) {
      throw new NotFoundException("Series not found")
    }

    const episode = await this.prisma.episode.findFirst({
      where: { id: episodeId, seriesId, status: "ready" },
      select: {
        id: true,
        title: true,
        synopsis: true,
        order: true,
        season: true,
        thumbnailUrl: true,
        durationSeconds: true,
        accessType: true,
        coinPrice: true,
        hlsUrl: true, // ← HLS URL for playback
        dashUrl: true,
        subtitleTracks: true,
        subtitleUrl: true,
        width: true,
        height: true,
      },
    })

    if (!episode) throw new NotFoundException("Episode not found")

    // For coin-gated episodes — strip HLS URL if not unlocked
    // TODO: check if viewer has unlocked this episode (coin purchase)
    if (episode.accessType === "coin_gated") {
      return { ...episode, hlsUrl: null, dashUrl: null }
    }

    return episode
  }

  async findPublicEpisodes(seriesId: string) {
    // Verify series is public first
    const series = await this.prisma.series.findUnique({
      where: { id: seriesId },
      select: { status: true, isPublic: true },
    })

    if (series?.status !== "published" || !series.isPublic) {
      throw new NotFoundException("Series not found")
    }

    return this.prisma.episode.findMany({
      where: { seriesId, status: "ready" },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        synopsis: true,
        order: true,
        season: true,
        thumbnailUrl: true,
        durationSeconds: true,
        accessType: true,
        coinPrice: true,
        hlsUrl: true, // null for coin-gated — client handles lock UI
      },
    })
  }

  // ---------------------------------------------------------------------------
  // List
  // ---------------------------------------------------------------------------

  async findAll(creatorId: string, filters: { status?: SeriesStatus } = {}) {
    return mapManySeriesGenres(
      await this.prisma.series.findMany({
        where: {
          creatorId,
          ...(filters.status
            ? { status: filters.status }
            : { status: { not: "archived" } }),
        },
        include: {
          _count: { select: { episodes: true } },
          ...seriesGenresInclude,
        },
        orderBy: { updatedAt: "desc" },
      })
    )
  }

  // ---------------------------------------------------------------------------
  // Find one
  // ---------------------------------------------------------------------------

  async findOne(creatorId: string, seriesId: string) {
    const series = await this.prisma.series.findUnique({
      where: { id: seriesId },
      include: {
        episodes: {
          where: { archivedAt: null },
          orderBy: { order: "asc" },
        },
        _count: { select: { episodes: true } },
        ...seriesGenresInclude,
      },
    })

    if (!series) throw new NotFoundException("Series not found")
    this.assertOwner(series.creatorId, creatorId)
    return mapSeriesGenres(series)
  }

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------

  async update(creatorId: string, seriesId: string, dto: UpdateSeriesDto) {
    await this.assertSeriesOwner(creatorId, seriesId)

    const genreIds =
      dto.genres !== undefined
        ? await this.resolveGenreIds(dto.genres)
        : undefined

    const series = await this.prisma.series.update({
      where: { id: seriesId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.synopsis !== undefined && { synopsis: dto.synopsis }),
        ...(dto.language !== undefined && { language: dto.language }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.posterUrl !== undefined && { posterUrl: dto.posterUrl }),
        ...(dto.trailerUrl !== undefined && { trailerUrl: dto.trailerUrl }),
        ...(dto.subtitleLanguages !== undefined && {
          subtitleLanguages: dto.subtitleLanguages,
        }),
        ...(dto.cast !== undefined && { cast: dto.cast as any }),
        ...(dto.crew !== undefined && { crew: dto.crew as any }),
        ...(dto.aiVerticalConversion !== undefined && {
          aiVerticalConversion: dto.aiVerticalConversion,
        }),
        ...(dto.autoCaptions !== undefined && {
          autoCaptions: dto.autoCaptions,
        }),
        ...(dto.defaultAccessType !== undefined && {
          defaultAccessType: dto.defaultAccessType,
        }),
        ...(dto.autoReframeTo916 !== undefined && {
          autoReframeTo916: dto.autoReframeTo916,
        }),
        ...(genreIds !== undefined && {
          seriesGenres: {
            deleteMany: {},
            create: genreIds.map((genreId) => ({ genreId })),
          },
        }),
      },
      include: seriesGenresInclude,
    })

    return mapSeriesGenres(series)
  }

  // ---------------------------------------------------------------------------
  // Update settings
  // ---------------------------------------------------------------------------

  async updateSettings(
    creatorId: string,
    seriesId: string,
    dto: UpdateSeriesSettingsDto
  ) {
    await this.assertSeriesOwner(creatorId, seriesId)

    return this.prisma.series.update({
      where: { id: seriesId },
      data: {
        ...(dto.isPublic !== undefined && { isPublic: dto.isPublic }),
        ...(dto.listedInSearch !== undefined && {
          listedInSearch: dto.listedInSearch,
        }),
        ...(dto.commentsEnabled !== undefined && {
          commentsEnabled: dto.commentsEnabled,
        }),
        ...(dto.tippingEnabled !== undefined && {
          tippingEnabled: dto.tippingEnabled,
        }),
      },
    })
  }

  // ---------------------------------------------------------------------------
  // Publish
  // ---------------------------------------------------------------------------

  async publish(creatorId: string, seriesId: string) {
    await this.assertSeriesOwner(creatorId, seriesId)

    const episodes = await this.prisma.episode.findMany({
      where: { seriesId },
      select: { status: true },
    })

    const allReady =
      episodes.length === 0 ||
      episodes.every((episode) => episode.status === "ready")

    if (!allReady) {
      throw new BadRequestException(
        "All episodes must finish processing before publishing"
      )
    }

    const status = "in_review"

    const series = await this.prisma.series.update({
      where: { id: seriesId },
      data: { status },
    })

    this.logger.log({
      event: "series_submitted_for_review",
      series_id: seriesId,
      creator_id: creatorId,
    })

    return series
  }

  // ---------------------------------------------------------------------------
  // Archive
  // ---------------------------------------------------------------------------

  async archive(creatorId: string, seriesId: string) {
    await this.assertSeriesOwner(creatorId, seriesId)

    const series = await this.prisma.series.findUniqueOrThrow({
      where: { id: seriesId },
      select: { status: true },
    })

    if (series.status === "archived") {
      throw new BadRequestException("Series is already archived")
    }

    return this.prisma.series.update({
      where: { id: seriesId },
      data: {
        status: "archived",
        archivedAt: new Date(),
        statusBeforeArchive: series.status,
      },
    })
  }

  async restore(creatorId: string, seriesId: string) {
    await this.assertSeriesOwner(creatorId, seriesId)

    const series = await this.prisma.series.findUniqueOrThrow({
      where: { id: seriesId },
      select: { status: true, statusBeforeArchive: true },
    })

    if (series.status !== "archived") {
      throw new BadRequestException("Series is not archived")
    }

    return this.prisma.series.update({
      where: { id: seriesId },
      data: {
        status: series.statusBeforeArchive ?? "draft",
        archivedAt: null,
        statusBeforeArchive: null,
      },
    })
  }

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  async remove(creatorId: string, seriesId: string) {
    await this.assertSeriesOwner(creatorId, seriesId)
    await this.prisma.series.delete({ where: { id: seriesId } })
    this.logger.log({
      event: "series_deleted",
      series_id: seriesId,
      creator_id: creatorId,
    })
  }

  // ---------------------------------------------------------------------------
  // Image upload — no series yet (wizard create flow)
  // ---------------------------------------------------------------------------

  async createImageUploadUrl(creatorId: string, contentType: string) {
    this.logger.log({
      event: "image_upload_url_requested",
      creator_id: creatorId,
    })
    return this.videoHosting.createImageUploadUrl({ creatorId, contentType })
  }

  // ---------------------------------------------------------------------------
  // Trailer upload — no series yet (wizard create flow)
  // ---------------------------------------------------------------------------

  async createTrailerUploadUrl(creatorId: string) {
    this.logger.log({
      event: "trailer_upload_url_requested",
      creator_id: creatorId,
    })
    return this.videoHosting.createVideo({
      title: `trailer-${creatorId}-${Date.now()}`,
      creatorId,
    })
  }

  // ---------------------------------------------------------------------------
  // Trailer status — poll after upload
  // ---------------------------------------------------------------------------

  async getTrailerStatus(_creatorId: string, videoId: string) {
    const metadata = await this.videoHosting.getVideoMetadata(videoId)
    return {
      status: metadata.status,
      hlsUrl: metadata.hlsUrl,
    }
  }

  // ---------------------------------------------------------------------------
  // Image upload — series exists (edit flow)
  // ---------------------------------------------------------------------------

  async createImageUploadUrlForSeries(
    creatorId: string,
    seriesId: string,
    contentType: string
  ) {
    await this.assertSeriesOwner(creatorId, seriesId)
    return this.videoHosting.createImageUploadUrl({ creatorId, contentType })
  }

  // ---------------------------------------------------------------------------
  // Trailer upload — series exists (edit flow)
  // ---------------------------------------------------------------------------

  async createTrailerUploadUrlForSeries(creatorId: string, seriesId: string) {
    await this.assertSeriesOwner(creatorId, seriesId)
    return this.videoHosting.createVideo({
      title: `trailer-${seriesId}`,
      creatorId,
    })
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private async getCreatorContentDefaults(creatorId: string) {
    const profile = await this.prisma.creatorProfile.findUnique({
      where: { accountId: creatorId },
      select: {
        defaultContentLanguage: true,
        defaultVisibility: true,
        commentsEnabledByDefault: true,
        tippingEnabledByDefault: true,
        autoPublishAfterProcessing: true,
      },
    })

    return {
      defaultContentLanguage:
        profile?.defaultContentLanguage ??
        DEFAULT_CREATOR_PREFERENCES.defaultContentLanguage,
      defaultVisibility:
        (profile?.defaultVisibility as (typeof DEFAULT_CREATOR_PREFERENCES)["defaultVisibility"]) ??
        DEFAULT_CREATOR_PREFERENCES.defaultVisibility,
      commentsEnabledByDefault:
        profile?.commentsEnabledByDefault ??
        DEFAULT_CREATOR_PREFERENCES.commentsEnabledByDefault,
      tippingEnabledByDefault:
        profile?.tippingEnabledByDefault ??
        DEFAULT_CREATOR_PREFERENCES.tippingEnabledByDefault,
      autoPublishAfterProcessing:
        profile?.autoPublishAfterProcessing ??
        DEFAULT_CREATOR_PREFERENCES.autoPublishAfterProcessing,
    }
  }

  private async assertSeriesOwner(creatorId: string, seriesId: string) {
    const series = await this.prisma.series.findUnique({
      where: { id: seriesId },
      select: { creatorId: true },
    })
    if (!series) throw new NotFoundException("Series not found")
    this.assertOwner(series.creatorId, creatorId)
  }

  private assertOwner(ownerId: string, requesterId: string) {
    if (ownerId !== requesterId) {
      throw new ForbiddenException("You do not own this series")
    }
  }

  private async resolveGenreIds(names: string[]): Promise<string[]> {
    if (names.length > MAX_SERIES_GENRES) {
      throw new BadRequestException(
        `A series can have at most ${MAX_SERIES_GENRES} genres`
      )
    }

    const uniqueNames = [...new Set(names)]
    if (uniqueNames.length === 0) return []

    const genres = await this.prisma.genre.findMany({
      where: { name: { in: uniqueNames }, isActive: true },
      select: { id: true, name: true },
    })

    if (genres.length !== uniqueNames.length) {
      const found = new Set(genres.map((genre) => genre.name))
      const invalid = uniqueNames.filter((name) => !found.has(name))
      throw new BadRequestException(`Invalid genres: ${invalid.join(", ")}`)
    }

    return genres.map((genre) => genre.id)
  }
}
