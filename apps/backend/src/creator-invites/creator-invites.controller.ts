import { Controller, Get, Param } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { CreatorInvitesService } from "./creator-invites.service"

@ApiTags("Creators")
@Controller("creators/invites")
export class CreatorInvitesController {
  constructor(private readonly creatorInvitesService: CreatorInvitesService) {}

  @Get(":token")
  @ApiOperation({
    summary: "Validate a creator invite token",
    description:
      "Public endpoint used by creator-web when opening `/onboarding?invite=…`.",
  })
  @ApiResponse({ status: 200, description: "Invite validation result" })
  @ApiResponse({ status: 404, description: "Invite not found" })
  validateInvite(@Param("token") token: string) {
    return this.creatorInvitesService.validateByToken(token)
  }
}
