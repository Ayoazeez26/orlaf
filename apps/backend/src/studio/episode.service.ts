import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { IVideoHostingProvider, VIDEO_HOSTING_PROVIDER } from "@sable/contracts"
import { CustomLogger } from "@sable/logger"
import { PrismaService } from "../prisma/prisma.service"
import { CloudflareWebhookDto } from "./dto/cloudfare.dto"
import type {
  CreateEpisodeDto,
  ReorderEpisodesDto,
  UpdateEpisodeDto,
} from "./dto/studio.dto"

// TODO(KAN-53): Sentry capture on errors

@Injectable()
export class EpisodeService {
  private readonly logger = new CustomLogger(EpisodeService.name)

  constructor(
    private readonly prisma: PrismaService,
    @Inject(VIDEO_HOSTING_PROVIDER)
    private readonly videoHosting: IVideoHostingProvider
  ) {}

  // ---------------------------------------------------------------------------
  // Create episode
  // ---------------------------------------------------------------------------

  async create(creatorId: string, seriesId: string, dto: CreateEpisodeDto) {
    await this.assertSeriesOwner(creatorId, seriesId)

    const episodeCount = await this.prisma.episode.count({
      where: { seriesId, archivedAt: null },
    })

    const episode = await this.prisma.episode.create({
      data: {
        seriesId,
        title: dto.title,
        synopsis: dto.synopsis,
        accessType: dto.accessType ?? "free",
        coinPrice: dto.coinPrice,
        order: episodeCount,
        aiVerticalConversion: dto.aiVerticalConversion ?? true,
        autoReframeTo916: dto.autoReframeTo916 ?? true,
        autoCaptionEnabled: dto.autoCaptionEnabled ?? true,
        season: dto.season ?? 1,
        subtitleUrl: dto.subtitleUrl,
      },
    })

    this.logger.log({
      event: "episode_created",
      episode_id: episode.id,
      series_id: seriesId,
    })

    return episode
  }

  // ---------------------------------------------------------------------------
  // List episodes
  // ---------------------------------------------------------------------------

  async findAll(creatorId: string, seriesId: string) {
    await this.assertSeriesOwner(creatorId, seriesId)

    return this.prisma.episode.findMany({
      where: { seriesId, archivedAt: null },
      orderBy: { order: "asc" },
    })
  }

  // ---------------------------------------------------------------------------
  // Get one
  // ---------------------------------------------------------------------------

  async findOne(creatorId: string, seriesId: string, episodeId: string) {
    await this.assertSeriesOwner(creatorId, seriesId)

    const episode = await this.prisma.episode.findFirst({
      where: { id: episodeId, seriesId },
    })

    if (!episode) throw new NotFoundException("Episode not found")

    return this.maybeRefreshFromVideoHosting(episode)
  }

  // ---------------------------------------------------------------------------
  // Update episode
  // ---------------------------------------------------------------------------

  async update(
    creatorId: string,
    seriesId: string,
    episodeId: string,
    dto: UpdateEpisodeDto
  ) {
    await this.assertSeriesOwner(creatorId, seriesId)

    return this.prisma.episode.update({
      where: { id: episodeId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.synopsis !== undefined && { synopsis: dto.synopsis }),
        ...(dto.accessType !== undefined && { accessType: dto.accessType }),
        ...(dto.coinPrice !== undefined && { coinPrice: dto.coinPrice }),
        ...(dto.aiVerticalConversion !== undefined && {
          aiVerticalConversion: dto.aiVerticalConversion,
        }),
      },
    })
  }

  // ---------------------------------------------------------------------------
  // Archive / restore episode
  // ---------------------------------------------------------------------------

  async archive(creatorId: string, seriesId: string, episodeId: string) {
    await this.assertSeriesOwner(creatorId, seriesId)

    const episode = await this.prisma.episode.findFirst({
      where: { id: episodeId, seriesId },
    })

    if (!episode) throw new NotFoundException("Episode not found")
    if (episode.archivedAt) {
      throw new BadRequestException("Episode is already archived")
    }

    return this.prisma.episode.update({
      where: { id: episodeId },
      data: { archivedAt: new Date() },
    })
  }

  async restore(creatorId: string, seriesId: string, episodeId: string) {
    await this.assertSeriesOwner(creatorId, seriesId)

    const episode = await this.prisma.episode.findFirst({
      where: { id: episodeId, seriesId },
    })

    if (!episode) throw new NotFoundException("Episode not found")
    if (!episode.archivedAt) {
      throw new BadRequestException("Episode is not archived")
    }

    return this.prisma.episode.update({
      where: { id: episodeId },
      data: { archivedAt: null },
    })
  }

  // ---------------------------------------------------------------------------
  // Delete episode
  // ---------------------------------------------------------------------------

  async remove(creatorId: string, seriesId: string, episodeId: string) {
    await this.assertSeriesOwner(creatorId, seriesId)

    const episode = await this.prisma.episode.findFirst({
      where: { id: episodeId, seriesId },
    })

    if (!episode) throw new NotFoundException("Episode not found")

    // Delete from video hosting provider if video exists
    if (episode.videoHostingId) {
      await this.videoHosting
        .deleteVideo(episode.videoHostingId)
        .catch((err) => {
          this.logger.warn({
            event: "video_hosting_delete_failed",
            episode_id: episodeId,
            error: (err as Error).message,
          })
        })
    }

    await this.prisma.episode.delete({ where: { id: episodeId } })

    this.logger.log({ event: "episode_deleted", episode_id: episodeId })
  }

  // ---------------------------------------------------------------------------
  // Reorder episodes
  // ---------------------------------------------------------------------------

  async reorder(creatorId: string, seriesId: string, dto: ReorderEpisodesDto) {
    await this.assertSeriesOwner(creatorId, seriesId)

    await this.prisma.$transaction(
      dto.episodeIds.map((id, index) =>
        this.prisma.episode.update({
          where: { id },
          data: { order: index },
        })
      )
    )

    this.logger.log({ event: "episodes_reordered", series_id: seriesId })
  }

  // ---------------------------------------------------------------------------
  // Get upload URL (called before client uploads video)
  // ---------------------------------------------------------------------------

  async createUploadUrl(
    creatorId: string,
    seriesId: string,
    episodeId: string
  ) {
    await this.assertSeriesOwner(creatorId, seriesId)

    const episode = await this.prisma.episode.findFirst({
      where: { id: episodeId, seriesId },
    })

    if (!episode) throw new NotFoundException("Episode not found")

    const result = await this.videoHosting.createVideo({
      title: episode.title,
      creatorId,
    })

    // Store the video hosting ID and mark as uploading
    await this.prisma.episode.update({
      where: { id: episodeId },
      data: {
        videoHostingId: result.videoId,
        status: "uploading",
      },
    })

    this.logger.log({
      event: "upload_url_created",
      episode_id: episodeId,
      video_id: result.videoId,
    })

    return {
      uploadUrl: result.uploadUrl,
      videoId: result.videoId,
    }
  }

  // ---------------------------------------------------------------------------
  // Handle webhook from video hosting provider
  // ---------------------------------------------------------------------------

  async handleVideoWebhook(payload: CloudflareWebhookDto) {
    const { uid, status, playback, input, duration, thumbnail, readyToStream } =
      payload

    const episode = await this.prisma.episode.findFirst({
      where: { videoHostingId: uid },
    })

    if (!episode) {
      this.logger.warn({ event: "webhook_episode_not_found", video_id: uid })
      return
    }

    const rawState =
      typeof status === "object" && status !== null
        ? String(status.state ?? "").toLowerCase()
        : String(status ?? "").toLowerCase()

    const statusMap: Record<string, string> = {
      ready: "ready",
      error: "failed",
      inprogress: "processing",
      queued: "processing",
      pendingupload: "uploading",
      downloading: "processing",
    }

    let episodeStatus = statusMap[rawState] ?? "processing"

    if (readyToStream === true && playback?.hls) {
      episodeStatus = "ready"
    }

    await this.prisma.episode.update({
      where: { id: episode.id },
      data: {
        status: episodeStatus as any,
        ...(playback?.hls && { hlsUrl: playback.hls }),
        ...(playback?.dash && { dashUrl: playback.dash }),
        ...(thumbnail && { thumbnailUrl: thumbnail }),
        ...(duration && { durationSeconds: duration }),
        ...(input?.width && { width: input.width }),
        ...(input?.height && { height: input.height }),
      },
    })

    this.logger.log({
      event: "video_webhook_processed",
      episode_id: episode.id,
      video_id: uid,
      status: episodeStatus,
    })
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private async maybeRefreshFromVideoHosting(episode: {
    id: string
    videoHostingId: string | null
    status: string
  }) {
    if (!episode.videoHostingId) return episode
    if (episode.status !== "uploading" && episode.status !== "processing") {
      return episode
    }

    const metadata = await this.videoHosting.getVideoMetadata(
      episode.videoHostingId
    )

    const statusMap: Record<string, string> = {
      pending: "uploading",
      processing: "processing",
      ready: "ready",
      failed: "failed",
    }

    const episodeStatus = statusMap[metadata.status] ?? "processing"

    return this.prisma.episode.update({
      where: { id: episode.id },
      data: {
        status: episodeStatus as any,
        ...(metadata.hlsUrl && { hlsUrl: metadata.hlsUrl }),
        ...(metadata.dashUrl && { dashUrl: metadata.dashUrl }),
        ...(metadata.thumbnailUrl && { thumbnailUrl: metadata.thumbnailUrl }),
        ...(metadata.durationSeconds != null && {
          durationSeconds: metadata.durationSeconds,
        }),
        ...(metadata.width != null && { width: metadata.width }),
        ...(metadata.height != null && { height: metadata.height }),
      },
    })
  }

  private async assertSeriesOwner(creatorId: string, seriesId: string) {
    const series = await this.prisma.series.findUnique({
      where: { id: seriesId },
      select: { creatorId: true },
    })

    if (!series) throw new NotFoundException("Series not found")

    if (series.creatorId !== creatorId) {
      throw new ForbiddenException("You do not own this series")
    }
  }
}
