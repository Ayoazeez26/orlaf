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
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger"
import type { AccessTokenClaims } from "@sable/contracts"
import { AdminRole } from "@sable/contracts"
import type { Request } from "express"
import { AdminAuthGuard } from "../auth/admin-auth.guard"
import { Roles } from "../auth/roles.decorator"
import { RolesGuard } from "../auth/roles.guard"
import { AdminSeriesService } from "./admin-series.service"
import {
  AdminSeriesActionDto,
  ListSeriesQueryDto,
} from "./dto/admin-series.dto"

@ApiTags("Admin · Series")
@Controller("admin/series")
@UseGuards(AdminAuthGuard, RolesGuard)
@Roles(AdminRole.CONTENT_ADMIN)
@ApiBearerAuth("access-token")
export class AdminSeriesController {
  constructor(private readonly seriesService: AdminSeriesService) {}

  @Get()
  @ApiOperation({ summary: "List all creator series with filters and stats" })
  list(@Query() query: ListSeriesQueryDto) {
    return this.seriesService.list(query)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single series with episodes" })
  @ApiResponse({ status: 404, description: "Series not found" })
  getOne(@Param("id") id: string) {
    return this.seriesService.getById(id)
  }

  @Post(":id/publish")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Approve and publish a series" })
  publish(
    @Param("id") id: string,
    @Body() body: AdminSeriesActionDto,
    @Req() req: Request & { user: AccessTokenClaims }
  ) {
    return this.seriesService.publish(id, req.user.sub, body)
  }

  @Post(":id/reject")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Reject a series" })
  reject(
    @Param("id") id: string,
    @Body() body: AdminSeriesActionDto,
    @Req() req: Request & { user: AccessTokenClaims }
  ) {
    return this.seriesService.reject(id, req.user.sub, body)
  }

  @Post(":id/unpublish")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Unpublish a series" })
  unpublish(
    @Param("id") id: string,
    @Body() body: AdminSeriesActionDto,
    @Req() req: Request & { user: AccessTokenClaims }
  ) {
    return this.seriesService.unpublish(id, req.user.sub, body)
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Permanently delete a series" })
  async remove(
    @Param("id") id: string,
    @Req() req: Request & { user: AccessTokenClaims }
  ) {
    await this.seriesService.remove(id, req.user.sub)
  }
}
