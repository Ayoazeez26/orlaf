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
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger"
import type { AccessTokenClaims } from "@sable/contracts"
import type { Request } from "express"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { ArchiveService } from "./archive.service"
import { ListArchiveQueryDto } from "./dto/archive.dto"
import { UpdateNotificationSettingsDto } from "./dto/notification-settings.dto"
import { UpdatePreferencesDto } from "./dto/preferences.dto"
import {
  GetAvatarUploadUrlDto,
  UpdateProfileDto,
  UpdateSocialLinksDto,
  UpdateStudioDto,
} from "./dto/profile.dto"
import { ProfileService } from "./profile.service"

@ApiTags("Profile")
@ApiBearerAuth("access-token")
@UseGuards(JwtAuthGuard)
@Controller("profile")
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly archiveService: ArchiveService
  ) {}

  // ---------------------------------------------------------------------------
  // GET /profile/me
  // ---------------------------------------------------------------------------

  @Get("me")
  @ApiOperation({
    summary: "Get current user profile",
    description:
      "Returns full profile including social links and creator studio info.",
  })
  @ApiResponse({ status: 200, description: "Profile returned" })
  async getMe(@Req() req: Request & { user: AccessTokenClaims }) {
    return this.profileService.getProfile(req.user.sub)
  }

  // ---------------------------------------------------------------------------
  // PATCH /profile/me
  // ---------------------------------------------------------------------------

  @Patch("me")
  @ApiOperation({
    summary: "Update personal profile",
    description:
      "Update first name, last name, display name, bio, phone, avatar.",
  })
  @ApiResponse({ status: 200, description: "Profile updated" })
  async updateProfile(
    @Req() req: Request & { user: AccessTokenClaims },
    @Body() dto: UpdateProfileDto
  ) {
    return this.profileService.updateProfile(req.user.sub, dto)
  }

  // ---------------------------------------------------------------------------
  // PATCH /profile/me/social
  // ---------------------------------------------------------------------------

  @Patch("me/social")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Update social links",
    description: "Update Instagram, Twitter/X, YouTube, TikTok URLs.",
  })
  @ApiResponse({ status: 200, description: "Social links updated" })
  async updateSocialLinks(
    @Req() req: Request & { user: AccessTokenClaims },
    @Body() dto: UpdateSocialLinksDto
  ) {
    return this.profileService.updateSocialLinks(req.user.sub, dto)
  }

  // ---------------------------------------------------------------------------
  // POST /profile/me/avatar-url
  // ---------------------------------------------------------------------------

  @Post("me/avatar-url")
  @ApiOperation({
    summary: "Get signed upload URL for profile avatar",
    description:
      "Returns a presigned R2 PUT URL. Upload the image directly to uploadUrl, then call PATCH /profile/me with the returned imageUrl as avatarUrl.",
  })
  @ApiResponse({
    status: 201,
    schema: {
      type: "object",
      properties: {
        uploadUrl: { type: "string", description: "PUT file here directly" },
        imageUrl: {
          type: "string",
          description: "Pass as avatarUrl after upload",
        },
      },
    },
  })
  async getAvatarUploadUrl(
    @Req() req: Request & { user: AccessTokenClaims },
    @Body() dto: GetAvatarUploadUrlDto
  ) {
    return this.profileService.getAvatarUploadUrl(req.user.sub, dto)
  }

  // ---------------------------------------------------------------------------
  // PATCH /profile/studio
  // ---------------------------------------------------------------------------

  @Patch("studio")
  @ApiOperation({
    summary: "Update studio profile",
    description:
      "Update studio name, handle, description, logo. Creator accounts only. Creates the studio profile if it doesn't exist yet.",
  })
  @ApiResponse({ status: 200, description: "Studio profile updated" })
  @ApiResponse({ status: 409, description: "Handle already taken" })
  async updateStudio(
    @Req() req: Request & { user: AccessTokenClaims },
    @Body() dto: UpdateStudioDto
  ) {
    return this.profileService.updateStudio(req.user.sub, dto)
  }

  // ---------------------------------------------------------------------------
  // POST /profile/studio/logo-url
  // ---------------------------------------------------------------------------

  @Post("studio/logo-url")
  @ApiOperation({
    summary: "Get signed upload URL for studio logo",
    description:
      "Returns a presigned R2 PUT URL. Upload the image directly to uploadUrl, then call PATCH /profile/studio with the returned imageUrl as logoUrl.",
  })
  @ApiResponse({
    status: 201,
    schema: {
      type: "object",
      properties: {
        uploadUrl: { type: "string", description: "PUT file here directly" },
        imageUrl: {
          type: "string",
          description: "Pass as logoUrl after upload",
        },
      },
    },
  })
  async getLogoUploadUrl(
    @Req() req: Request & { user: AccessTokenClaims },
    @Body() dto: GetAvatarUploadUrlDto
  ) {
    return this.profileService.getLogoUploadUrl(req.user.sub, dto)
  }

  // ---------------------------------------------------------------------------
  // GET /profile/preferences
  // ---------------------------------------------------------------------------

  @Get("preferences")
  @ApiOperation({
    summary: "Get creator preferences",
    description:
      "Returns content defaults and dashboard display settings for the current creator.",
  })
  @ApiResponse({ status: 200, description: "Preferences returned" })
  async getPreferences(@Req() req: Request & { user: AccessTokenClaims }) {
    return this.profileService.getPreferences(req.user.sub)
  }

  // ---------------------------------------------------------------------------
  // PATCH /profile/preferences
  // ---------------------------------------------------------------------------

  @Patch("preferences")
  @ApiOperation({
    summary: "Update creator preferences",
    description: "Update content defaults and dashboard display settings.",
  })
  @ApiResponse({ status: 200, description: "Preferences updated" })
  async updatePreferences(
    @Req() req: Request & { user: AccessTokenClaims },
    @Body() dto: UpdatePreferencesDto
  ) {
    return this.profileService.updatePreferences(req.user.sub, dto)
  }

  // ---------------------------------------------------------------------------
  // GET /profile/notification-settings
  // ---------------------------------------------------------------------------

  @Get("notification-settings")
  @ApiOperation({
    summary: "Get creator notification settings",
    description:
      "Returns notification channel and event preferences for the current creator.",
  })
  @ApiResponse({ status: 200, description: "Notification settings returned" })
  async getNotificationSettings(
    @Req() req: Request & { user: AccessTokenClaims }
  ) {
    return this.profileService.getNotificationSettings(req.user.sub)
  }

  // ---------------------------------------------------------------------------
  // PATCH /profile/notification-settings
  // ---------------------------------------------------------------------------

  @Patch("notification-settings")
  @ApiOperation({
    summary: "Update creator notification settings",
    description: "Update notification channel and event preferences.",
  })
  @ApiResponse({ status: 200, description: "Notification settings updated" })
  @ApiResponse({
    status: 400,
    description: "Push notifications not available yet",
  })
  async updateNotificationSettings(
    @Req() req: Request & { user: AccessTokenClaims },
    @Body() dto: UpdateNotificationSettingsDto
  ) {
    return this.profileService.updateNotificationSettings(req.user.sub, dto)
  }

  // ---------------------------------------------------------------------------
  // GET /profile/archive
  // ---------------------------------------------------------------------------

  @Get("archive")
  @ApiOperation({
    summary: "List archived creator items",
    description:
      "Returns archived projects and episodes with counts per category.",
  })
  async getArchive(
    @Req() req: Request & { user: AccessTokenClaims },
    @Query() query: ListArchiveQueryDto
  ) {
    return this.archiveService.listArchive(
      req.user.sub,
      req.user.account_type,
      query.type ?? "all"
    )
  }

  // ---------------------------------------------------------------------------
  // DELETE /profile/archive — must be registered before /archive/:kind/:id
  // ---------------------------------------------------------------------------

  @Delete("archive")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Permanently delete all archived items" })
  async emptyArchive(@Req() req: Request & { user: AccessTokenClaims }) {
    await this.archiveService.emptyArchive(req.user.sub, req.user.account_type)
  }

  // ---------------------------------------------------------------------------
  // POST /profile/archive/:kind/:id/restore
  // ---------------------------------------------------------------------------

  @Post("archive/:kind/:id/restore")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Restore an archived item" })
  async restoreArchiveItem(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("kind") kind: string,
    @Param("id") id: string
  ) {
    await this.archiveService.restoreItem(
      req.user.sub,
      req.user.account_type,
      kind,
      id
    )
  }

  // ---------------------------------------------------------------------------
  // DELETE /profile/archive/:kind/:id
  // ---------------------------------------------------------------------------

  @Delete("archive/:kind/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Permanently delete an archived item" })
  async deleteArchiveItem(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("kind") kind: string,
    @Param("id") id: string
  ) {
    await this.archiveService.deleteItem(
      req.user.sub,
      req.user.account_type,
      kind,
      id
    )
  }
}
