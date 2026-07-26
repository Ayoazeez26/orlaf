import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import type { AccessTokenClaims } from "@sable/contracts"
import type { Request } from "express"
import { OptionalJwtAuthGuard } from "../auth/optional-jwt-auth.guard"
import {
  PlaybackHeartbeatDto,
  StartPlaybackSessionDto,
} from "./dto/playback.dto"
import { PlaybackService } from "./playback.service"

type OptionalAuthRequest = Request & { user?: AccessTokenClaims }

@ApiTags("Playback")
@Controller("playback")
@UseGuards(OptionalJwtAuthGuard)
export class PlaybackController {
  constructor(private readonly playbackService: PlaybackService) {}

  @Post("sessions")
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Start a playback session for telemetry" })
  async startSession(
    @Req() req: OptionalAuthRequest,
    @Body() dto: StartPlaybackSessionDto
  ) {
    return this.playbackService.startSession(
      {
        episode_id: dto.episode_id,
        anon_id: dto.anon_id,
        device_type: dto.device_type,
        platform: dto.platform,
        source: dto.source,
        app_version: dto.app_version,
      },
      req.user?.sub
    )
  }

  @Patch("sessions/:sessionId")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Heartbeat or end a playback session" })
  async heartbeat(
    @Req() req: OptionalAuthRequest,
    @Param("sessionId") sessionId: string,
    @Body() dto: PlaybackHeartbeatDto
  ) {
    return this.playbackService.heartbeat(
      sessionId,
      {
        watched_seconds: dto.watched_seconds,
        max_position_seconds: dto.max_position_seconds,
        completed: dto.completed,
        ended: dto.ended,
      },
      req.user?.sub
    )
  }
}
