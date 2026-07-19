import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
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
import { AccountType } from "@sable/contracts"
import type { Request } from "express"
import { SkipConsent } from "../auth/consent.guard"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { PatchOnboardingDto } from "./dto/onboarding.dto"
import { OnboardingService } from "./onboarding.service"

@ApiTags("Creators")
@Controller("creators/onboarding")
@UseGuards(JwtAuthGuard)
@SkipConsent()
@ApiBearerAuth("access-token")
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get()
  @ApiOperation({ summary: "Get creator onboarding status and saved progress" })
  @ApiResponse({ status: 200, description: "Onboarding status" })
  getOnboarding(@Req() req: Request & { user: AccessTokenClaims }) {
    this.assertCreator(req.user)
    return this.onboardingService.getStatus(req.user.sub)
  }

  @Patch()
  @ApiOperation({ summary: "Update creator onboarding profile (partial)" })
  @ApiResponse({ status: 200, description: "Updated onboarding status" })
  patchOnboarding(
    @Req() req: Request & { user: AccessTokenClaims },
    @Body() body: PatchOnboardingDto
  ) {
    this.assertCreator(req.user)
    return this.onboardingService.patchProfile(req.user.sub, body)
  }

  @Post("complete")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Complete creator onboarding" })
  @ApiResponse({ status: 200, description: "Onboarding completed" })
  completeOnboarding(@Req() req: Request & { user: AccessTokenClaims }) {
    this.assertCreator(req.user)
    return this.onboardingService.complete(req.user.sub)
  }

  private assertCreator(user: AccessTokenClaims): void {
    if (user.account_type !== AccountType.CREATOR) {
      throw new ForbiddenException(
        "Only creator accounts can access onboarding."
      )
    }
  }
}
