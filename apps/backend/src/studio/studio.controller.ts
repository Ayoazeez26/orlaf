import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common"
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger"
import type { AccessTokenClaims } from "@sable/contracts"
import type { Request } from "express"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import {
  CreateEpisodeDto,
  CreateSeriesDto,
  ReorderEpisodesDto,
  UpdateEpisodeDto,
  UpdateSeriesDto,
  UpdateSeriesSettingsDto,
} from "./dto/studio.dto"
import { GetImageUploadUrlDto, GetVideoUploadUrlDto } from "./dto/upload.dto"
import { EpisodeService } from "./episode.service"
import { SeriesService } from "./series.service"

@ApiTags("Studio")
@ApiBearerAuth("access-token")
@UseGuards(JwtAuthGuard)
@Controller("studio")
export class StudioController {
  constructor(
    private readonly seriesService: SeriesService,
    private readonly episodeService: EpisodeService
  ) {}

  // ---------------------------------------------------------------------------
  // General uploads (no series required — wizard create flow)
  // ---------------------------------------------------------------------------

  @Post("upload/image")
  @ApiOperation({
    summary: "Get signed upload URL for a poster image",
    description:
      "Use before a series exists (wizard step 1). Client PUTs file directly to uploadUrl, then passes imageUrl as posterUrl when creating the series.",
  })
  @ApiResponse({
    status: 201,
    schema: {
      type: "object",
      properties: {
        uploadUrl: {
          type: "string",
          description: "Presigned R2 PUT URL — upload file here",
        },
        imageUrl: {
          type: "string",
          description: "Public URL to store as posterUrl",
        },
      },
    },
  })
  async getImageUploadUrl(
    @Req() req: Request & { user: AccessTokenClaims },
    @Body() dto: GetImageUploadUrlDto
  ) {
    return this.seriesService.createImageUploadUrl(
      req.user.sub,
      dto.contentType
    )
  }

  @Post("upload/trailer")
  @ApiOperation({
    summary: "Get signed upload URL for a trailer video",
    description:
      "Use before a series exists (wizard step 1). Client PUTs file directly to uploadUrl. Poll GET /studio/trailer-status/:videoId until ready to get the HLS URL.",
  })
  @ApiResponse({
    status: 201,
    schema: {
      type: "object",
      properties: {
        uploadUrl: {
          type: "string",
          description: "Cloudflare Stream upload URL",
        },
        videoId: {
          type: "string",
          description: "Video ID — use to poll trailer status",
        },
      },
    },
  })
  async getTrailerUploadUrl(
    @Req() req: Request & { user: AccessTokenClaims },
    @Body() _dto: GetVideoUploadUrlDto
  ) {
    return this.seriesService.createTrailerUploadUrl(req.user.sub)
  }

  @Get("trailer-status/:videoId")
  @ApiOperation({
    summary: "Poll trailer transcode status",
    description: "Poll until status is ready to get the HLS URL.",
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["pending", "processing", "ready", "failed"],
        },
        hlsUrl: { type: "string", nullable: true },
      },
    },
  })
  async getTrailerStatus(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("videoId") videoId: string
  ) {
    return this.seriesService.getTrailerStatus(req.user.sub, videoId)
  }

  // ---------------------------------------------------------------------------
  // Series
  // ---------------------------------------------------------------------------

  @Post("series")
  @ApiOperation({ summary: "Create a new series" })
  @ApiResponse({ status: 201, description: "Series created" })
  async createSeries(
    @Req() req: Request & { user: AccessTokenClaims },
    @Body() dto: CreateSeriesDto
  ) {
    return this.seriesService.create(req.user.sub, dto)
  }

  @Get("series")
  @ApiOperation({ summary: "List creator series" })
  @ApiQuery({
    name: "status",
    required: false,
    enum: ["draft", "in_review", "published", "rejected", "archived"],
  })
  async listSeries(
    @Req() req: Request & { user: AccessTokenClaims },
    @Query("status") status?: string
  ) {
    return this.seriesService.findAll(req.user.sub, { status: status as any })
  }

  @Get("series/:seriesId")
  @ApiOperation({ summary: "Get series detail" })
  async getSeries(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string
  ) {
    return this.seriesService.findOne(req.user.sub, seriesId)
  }

  @Patch("series/:seriesId")
  @ApiOperation({ summary: "Update series info" })
  async updateSeries(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string,
    @Body() dto: UpdateSeriesDto
  ) {
    return this.seriesService.update(req.user.sub, seriesId, dto)
  }

  @Patch("series/:seriesId/settings")
  @ApiOperation({
    summary: "Update series visibility and monetization settings",
  })
  async updateSeriesSettings(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string,
    @Body() dto: UpdateSeriesSettingsDto
  ) {
    return this.seriesService.updateSettings(req.user.sub, seriesId, dto)
  }

  @Post("series/:seriesId/publish")
  @ApiOperation({ summary: "Submit series for review" })
  async publishSeries(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string
  ) {
    return this.seriesService.publish(req.user.sub, seriesId)
  }

  @Post("series/:seriesId/archive")
  @ApiOperation({ summary: "Archive series" })
  async archiveSeries(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string
  ) {
    return this.seriesService.archive(req.user.sub, seriesId)
  }

  @Delete("series/:seriesId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete series and all episodes" })
  async deleteSeries(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string
  ) {
    await this.seriesService.remove(req.user.sub, seriesId)
  }

  // Series-scoped uploads (edit flow — series already exists)

  @Post("series/:seriesId/upload/image")
  @ApiOperation({
    summary: "Get signed upload URL for series poster (edit flow)",
  })
  async getSeriesImageUploadUrl(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string,
    @Body() dto: GetImageUploadUrlDto
  ) {
    return this.seriesService.createImageUploadUrlForSeries(
      req.user.sub,
      seriesId,
      dto.contentType
    )
  }

  @Post("series/:seriesId/upload/trailer")
  @ApiOperation({
    summary: "Get signed upload URL for series trailer (edit flow)",
  })
  async getSeriesTrailerUploadUrl(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string
  ) {
    return this.seriesService.createTrailerUploadUrlForSeries(
      req.user.sub,
      seriesId
    )
  }

  // ---------------------------------------------------------------------------
  // Episodes
  // ---------------------------------------------------------------------------

  @Post("series/:seriesId/episodes")
  @ApiOperation({ summary: "Create a new episode" })
  async createEpisode(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string,
    @Body() dto: CreateEpisodeDto
  ) {
    return this.episodeService.create(req.user.sub, seriesId, dto)
  }

  @Get("series/:seriesId/episodes")
  @ApiOperation({ summary: "List episodes for a series" })
  async listEpisodes(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string
  ) {
    return this.episodeService.findAll(req.user.sub, seriesId)
  }

  @Get("series/:seriesId/episodes/:episodeId")
  @ApiOperation({ summary: "Get episode detail" })
  async getEpisode(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string,
    @Param("episodeId") episodeId: string
  ) {
    return this.episodeService.findOne(req.user.sub, seriesId, episodeId)
  }

  @Patch("series/:seriesId/episodes/:episodeId")
  @ApiOperation({ summary: "Update episode" })
  async updateEpisode(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string,
    @Param("episodeId") episodeId: string,
    @Body() dto: UpdateEpisodeDto
  ) {
    return this.episodeService.update(req.user.sub, seriesId, episodeId, dto)
  }

  @Delete("series/:seriesId/episodes/:episodeId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete episode" })
  async deleteEpisode(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string,
    @Param("episodeId") episodeId: string
  ) {
    await this.episodeService.remove(req.user.sub, seriesId, episodeId)
  }

  @Post("series/:seriesId/episodes/:episodeId/archive")
  @ApiOperation({ summary: "Archive episode" })
  async archiveEpisode(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string,
    @Param("episodeId") episodeId: string
  ) {
    return this.episodeService.archive(req.user.sub, seriesId, episodeId)
  }

  @Patch("series/:seriesId/episodes/reorder")
  @ApiOperation({ summary: "Reorder episodes" })
  async reorderEpisodes(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string,
    @Body() dto: ReorderEpisodesDto
  ) {
    return this.episodeService.reorder(req.user.sub, seriesId, dto)
  }

  @Post("series/:seriesId/episodes/:episodeId/upload-url")
  @ApiOperation({
    summary: "Get a signed upload URL for an episode video",
    description:
      "Returns a URL the client uses to upload directly to Cloudflare Stream. After upload, Cloudflare transcodes to HLS and fires a webhook when ready.",
  })
  @ApiResponse({
    status: 201,
    schema: {
      type: "object",
      properties: {
        uploadUrl: { type: "string" },
        videoId: { type: "string" },
      },
    },
  })
  async getEpisodeUploadUrl(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string,
    @Param("episodeId") episodeId: string
  ) {
    return this.episodeService.createUploadUrl(
      req.user.sub,
      seriesId,
      episodeId
    )
  }
}
