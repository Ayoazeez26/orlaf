import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import type {
  PlaybackHeartbeatRequest,
  PlaybackHeartbeatResponse,
  StartPlaybackSessionRequest,
  StartPlaybackSessionResponse,
} from "@sable/contracts"
import { PrismaService } from "../prisma/prisma.service"

const VIEW_THRESHOLD_SECONDS = 3
const ENGAGEABLE_SERIES_STATUSES = ["published"] as const

@Injectable()
export class PlaybackService {
  constructor(private readonly prisma: PrismaService) {}

  async startSession(
    dto: StartPlaybackSessionRequest,
    accountId?: string
  ): Promise<StartPlaybackSessionResponse> {
    const anonId = dto.anon_id?.trim() || null
    if (!accountId && !anonId) {
      throw new BadRequestException(
        "anon_id is required when not authenticated"
      )
    }

    const episode = await this.prisma.episode.findUnique({
      where: { id: dto.episode_id },
      select: {
        id: true,
        seriesId: true,
        durationSeconds: true,
        archivedAt: true,
        series: {
          select: {
            id: true,
            creatorId: true,
            status: true,
            isPublic: true,
            archivedAt: true,
          },
        },
      },
    })

    if (
      !episode ||
      episode.archivedAt ||
      !episode.series ||
      !ENGAGEABLE_SERIES_STATUSES.includes(
        episode.series.status as (typeof ENGAGEABLE_SERIES_STATUSES)[number]
      ) ||
      !episode.series.isPublic ||
      episode.series.archivedAt
    ) {
      throw new NotFoundException("Episode not found")
    }

    const durationSeconds =
      episode.durationSeconds != null
        ? Math.max(0, Math.round(episode.durationSeconds))
        : null

    const session = await this.prisma.playbackSession.create({
      data: {
        episodeId: episode.id,
        seriesId: episode.seriesId,
        creatorId: episode.series.creatorId,
        accountId: accountId ?? null,
        anonId,
        deviceType: dto.device_type,
        platform: dto.platform ?? null,
        source: dto.source ?? null,
        appVersion: dto.app_version ?? null,
        durationSeconds,
      },
      select: { id: true },
    })

    return { session_id: session.id }
  }

  async heartbeat(
    sessionId: string,
    dto: PlaybackHeartbeatRequest,
    accountId?: string
  ): Promise<PlaybackHeartbeatResponse> {
    const session = await this.prisma.playbackSession.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        accountId: true,
        anonId: true,
        watchedSeconds: true,
        maxPositionSeconds: true,
        durationSeconds: true,
        countedAsView: true,
        completed: true,
        endedAt: true,
      },
    })

    if (!session) {
      throw new NotFoundException("Playback session not found")
    }

    // Optional auth: if the session was started by an account, only that
    // account (or anonymous heartbeats without claiming ownership) may update.
    if (
      session.accountId &&
      accountId &&
      session.accountId !== accountId
    ) {
      throw new NotFoundException("Playback session not found")
    }

    if (dto.watched_seconds < session.watchedSeconds) {
      throw new BadRequestException("watched_seconds must be non-decreasing")
    }

    if (dto.max_position_seconds < session.maxPositionSeconds) {
      throw new BadRequestException(
        "max_position_seconds must be non-decreasing"
      )
    }

    let watchedSeconds = dto.watched_seconds
    if (session.durationSeconds != null && session.durationSeconds > 0) {
      const cap = Math.ceil(session.durationSeconds * 1.2)
      watchedSeconds = Math.min(watchedSeconds, cap)
    }

    const completedFromPosition =
      session.durationSeconds != null &&
      session.durationSeconds > 0 &&
      dto.max_position_seconds >= Math.floor(session.durationSeconds * 0.9)

    const completed =
      session.completed || !!dto.completed || completedFromPosition

    const countedAsView =
      session.countedAsView || watchedSeconds >= VIEW_THRESHOLD_SECONDS

    const updated = await this.prisma.playbackSession.update({
      where: { id: session.id },
      data: {
        watchedSeconds,
        maxPositionSeconds: dto.max_position_seconds,
        lastHeartbeatAt: new Date(),
        completed,
        countedAsView,
        ...(dto.ended && !session.endedAt ? { endedAt: new Date() } : {}),
      },
      select: {
        id: true,
        countedAsView: true,
      },
    })

    return {
      session_id: updated.id,
      counted_as_view: updated.countedAsView,
    }
  }
}
