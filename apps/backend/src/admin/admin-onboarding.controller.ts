import {
  Body,
  Controller,
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
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger"
import type { AccessTokenClaims } from "@sable/contracts"
import { AdminRole } from "@sable/contracts"
import type { Request } from "express"
import { AdminAuthGuard } from "../auth/admin-auth.guard"
import { Roles } from "../auth/roles.decorator"
import { RolesGuard } from "../auth/roles.guard"
import { AdminOnboardingService } from "./admin-onboarding.service"
import {
  CreateCreatorInviteDto,
  ListApplicationsQueryDto,
  ListInvitesQueryDto,
  RejectApplicationDto,
} from "./dto/admin-onboarding.dto"

@ApiTags("Admin · Onboarding")
@Controller("admin/onboarding")
@UseGuards(AdminAuthGuard, RolesGuard)
@Roles(AdminRole.CONTENT_ADMIN, AdminRole.SUPPORT_ADMIN)
@ApiBearerAuth("access-token")
export class AdminOnboardingController {
  constructor(private readonly onboarding: AdminOnboardingService) {}

  // Applications ----------------------------------------------------------------

  @Get("applications")
  @ApiOperation({ summary: "List creator applications with filters and stats" })
  @ApiResponse({ status: 200, description: "Paginated applications list" })
  listApplications(@Query() query: ListApplicationsQueryDto) {
    return this.onboarding.listApplications(query)
  }

  @Get("applications/:id")
  @ApiOperation({ summary: "Get a single application's detail + checklist" })
  @ApiResponse({ status: 200, description: "Application detail" })
  @ApiResponse({ status: 404, description: "Application not found" })
  getApplication(@Param("id") id: string) {
    return this.onboarding.getApplication(id)
  }

  @Post("applications/:id/approve")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Approve a creator application" })
  @ApiResponse({ status: 200, description: "Application approved" })
  @ApiResponse({ status: 400, description: "Invalid status transition" })
  approve(
    @Param("id") id: string,
    @Req() req: Request & { user: AccessTokenClaims }
  ) {
    return this.onboarding.approve(id, req.user.sub)
  }

  @Post("applications/:id/reject")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Reject a creator application" })
  @ApiResponse({ status: 200, description: "Application rejected" })
  @ApiResponse({ status: 400, description: "Invalid status transition" })
  reject(
    @Param("id") id: string,
    @Body() body: RejectApplicationDto,
    @Req() req: Request & { user: AccessTokenClaims }
  ) {
    return this.onboarding.reject(id, req.user.sub, body)
  }

  @Post("applications/:id/reopen")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Reopen a rejected application" })
  @ApiResponse({ status: 200, description: "Application reopened" })
  @ApiResponse({ status: 400, description: "Invalid status transition" })
  reopen(
    @Param("id") id: string,
    @Req() req: Request & { user: AccessTokenClaims }
  ) {
    return this.onboarding.reopen(id, req.user.sub)
  }

  // Invites ---------------------------------------------------------------------

  @Get("invites")
  @ApiOperation({ summary: "List creator invites with filters and stats" })
  @ApiResponse({ status: 200, description: "Paginated invites list" })
  listInvites(@Query() query: ListInvitesQueryDto) {
    return this.onboarding.listInvites(query)
  }

  @Post("invites")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create and send a creator invite" })
  @ApiResponse({ status: 201, description: "Invite created and sent" })
  @ApiResponse({
    status: 409,
    description: "Duplicate creator or active invite",
  })
  createInvite(
    @Body() body: CreateCreatorInviteDto,
    @Req() req: Request & { user: AccessTokenClaims }
  ) {
    return this.onboarding.createInvite(req.user.sub, body)
  }

  @Post("invites/:id/resend")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Resend a creator invite" })
  @ApiResponse({ status: 200, description: "Invite resent" })
  @ApiResponse({ status: 404, description: "Invite not found" })
  resendInvite(@Param("id") id: string) {
    return this.onboarding.resendInvite(id)
  }

  @Post("invites/:id/revoke")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Revoke a creator invite" })
  @ApiResponse({ status: 200, description: "Invite revoked" })
  @ApiResponse({ status: 404, description: "Invite not found" })
  revokeInvite(@Param("id") id: string) {
    return this.onboarding.revokeInvite(id)
  }
}
