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
import { AdminCreatorsService } from "./admin-creators.service"
import {
  ListCreatorsQueryDto,
  SuspendCreatorDto,
  VerifyCreatorDto,
} from "./dto/admin-creators.dto"

@ApiTags("Admin · Creators")
@Controller("admin/creators")
@UseGuards(AdminAuthGuard, RolesGuard)
@Roles(AdminRole.CONTENT_ADMIN, AdminRole.SUPPORT_ADMIN)
@ApiBearerAuth("access-token")
export class AdminCreatorsController {
  constructor(private readonly creatorsService: AdminCreatorsService) {}

  @Get()
  @ApiOperation({ summary: "List creators with filters, search, and stats" })
  @ApiResponse({ status: 200, description: "Paginated creators list" })
  list(@Query() query: ListCreatorsQueryDto) {
    return this.creatorsService.list(query)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single creator's admin detail" })
  @ApiResponse({ status: 200, description: "Creator detail" })
  @ApiResponse({ status: 404, description: "Creator not found" })
  getOne(@Param("id") id: string) {
    return this.creatorsService.getById(id)
  }

  @Post(":id/verify")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Grant a creator the verified badge" })
  @ApiResponse({ status: 200, description: "Creator verified" })
  verify(
    @Param("id") id: string,
    @Body() body: VerifyCreatorDto,
    @Req() req: Request & { user: AccessTokenClaims }
  ) {
    return this.creatorsService.verify(id, req.user.sub, body)
  }

  @Post(":id/unverify")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Remove a creator's verified badge" })
  @ApiResponse({ status: 200, description: "Creator unverified" })
  unverify(
    @Param("id") id: string,
    @Req() req: Request & { user: AccessTokenClaims }
  ) {
    return this.creatorsService.unverify(id, req.user.sub)
  }

  @Post(":id/suspend")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Suspend a creator account" })
  @ApiResponse({ status: 200, description: "Creator suspended" })
  @ApiResponse({ status: 400, description: "Invalid status transition" })
  suspend(
    @Param("id") id: string,
    @Body() body: SuspendCreatorDto,
    @Req() req: Request & { user: AccessTokenClaims }
  ) {
    return this.creatorsService.suspend(id, req.user.sub, body)
  }

  @Post(":id/reactivate")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Reactivate a suspended creator account" })
  @ApiResponse({ status: 200, description: "Creator reactivated" })
  @ApiResponse({ status: 400, description: "Invalid status transition" })
  reactivate(
    @Param("id") id: string,
    @Req() req: Request & { user: AccessTokenClaims }
  ) {
    return this.creatorsService.reactivate(id, req.user.sub)
  }
}
