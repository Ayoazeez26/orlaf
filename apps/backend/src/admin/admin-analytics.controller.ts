import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger"
import { AdminRole } from "@sable/contracts"
import { AdminAuthGuard } from "../auth/admin-auth.guard"
import { Roles } from "../auth/roles.decorator"
import { RolesGuard } from "../auth/roles.guard"
import { AdminAnalyticsService } from "./admin-analytics.service"
import { AdminAnalyticsOverviewQueryDto } from "./dto/admin-analytics.dto"

@ApiTags("Admin · Analytics")
@Controller("admin/analytics")
@UseGuards(AdminAuthGuard, RolesGuard)
@Roles(
  AdminRole.SUPER_ADMIN,
  AdminRole.CONTENT_ADMIN,
  AdminRole.MARKETING_ADMIN,
  AdminRole.FINANCE_ADMIN
)
@ApiBearerAuth("access-token")
export class AdminAnalyticsController {
  constructor(private readonly analyticsService: AdminAnalyticsService) {}

  @Get("overview")
  @ApiOperation({
    summary:
      "Platform growth overview — new users/creators KPIs and growth series",
  })
  @ApiQuery({
    name: "range",
    required: false,
    enum: ["7d", "30d", "90d"],
  })
  @ApiResponse({ status: 200, description: "Admin analytics overview" })
  getOverview(@Query() query: AdminAnalyticsOverviewQueryDto) {
    return this.analyticsService.getOverview(query.range ?? "30d")
  }
}
