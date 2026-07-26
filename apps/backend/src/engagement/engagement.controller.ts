import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common"
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger"
import type { AccessTokenClaims } from "@sable/contracts"
import type { Request } from "express"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { OptionalJwtAuthGuard } from "../auth/optional-jwt-auth.guard"
import {
  CreateCommentDto,
  ListCommentsQueryDto,
  RecordShareDto,
} from "./dto/engagement.dto"
import { EngagementService } from "./engagement.service"

type AuthedRequest = Request & { user: AccessTokenClaims }
type OptionalAuthRequest = Request & { user?: AccessTokenClaims }

@ApiTags("Engagement")
@Controller("engagement")
export class EngagementController {
  constructor(private readonly engagementService: EngagementService) {}

  @Get("series/:seriesId/summary")
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: "Series engagement counts (likes, comments, shares)" })
  async getSummary(
    @Req() req: OptionalAuthRequest,
    @Param("seriesId") seriesId: string
  ) {
    return this.engagementService.getSummary(seriesId, req.user?.sub)
  }

  @Get("series/:seriesId/like/status")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Whether the viewer liked this series" })
  async getLikeStatus(
    @Req() req: AuthedRequest,
    @Param("seriesId") seriesId: string
  ) {
    return this.engagementService.getLikeStatus(req.user.sub, seriesId)
  }

  @Post("series/:seriesId/like")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Like a series" })
  async likeSeries(
    @Req() req: AuthedRequest,
    @Param("seriesId") seriesId: string
  ) {
    await this.engagementService.likeSeries(req.user.sub, seriesId)
  }

  @Delete("series/:seriesId/like")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Unlike a series" })
  async unlikeSeries(
    @Req() req: AuthedRequest,
    @Param("seriesId") seriesId: string
  ) {
    await this.engagementService.unlikeSeries(req.user.sub, seriesId)
  }

  @Get("series/:seriesId/comments")
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: "List series comments (nested replies on top-level)" })
  async listComments(
    @Req() req: OptionalAuthRequest,
    @Param("seriesId") seriesId: string,
    @Query() query: ListCommentsQueryDto
  ) {
    return this.engagementService.listComments(seriesId, {
      accountId: req.user?.sub,
      parentId: query.parent_id,
      cursor: query.cursor,
    })
  }

  @Post("series/:seriesId/comments")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Create a comment or reply" })
  async createComment(
    @Req() req: AuthedRequest,
    @Param("seriesId") seriesId: string,
    @Body() dto: CreateCommentDto
  ) {
    return this.engagementService.createComment(req.user.sub, seriesId, {
      body: dto.body,
      parent_id: dto.parent_id,
    })
  }

  @Delete("comments/:commentId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Soft-delete own comment" })
  async deleteComment(
    @Req() req: AuthedRequest,
    @Param("commentId") commentId: string
  ) {
    await this.engagementService.deleteComment(req.user.sub, commentId)
  }

  @Post("comments/:commentId/like")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Like a comment" })
  async likeComment(
    @Req() req: AuthedRequest,
    @Param("commentId") commentId: string
  ) {
    await this.engagementService.likeComment(req.user.sub, commentId)
  }

  @Delete("comments/:commentId/like")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Unlike a comment" })
  async unlikeComment(
    @Req() req: AuthedRequest,
    @Param("commentId") commentId: string
  ) {
    await this.engagementService.unlikeComment(req.user.sub, commentId)
  }

  @Post("series/:seriesId/shares")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: "Record a share event for metrics" })
  async recordShare(
    @Req() req: OptionalAuthRequest,
    @Param("seriesId") seriesId: string,
    @Body() dto: RecordShareDto
  ) {
    await this.engagementService.recordShare(
      seriesId,
      { channel: dto.channel },
      req.user?.sub
    )
  }
}
