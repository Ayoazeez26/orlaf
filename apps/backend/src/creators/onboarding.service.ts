import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import {
  CompleteOnboardingResponse,
  OnboardingProfileData,
  OnboardingStatusResponse,
  OnboardingStepId,
} from "@sable/contracts"
import { CustomLogger } from "@sable/logger"
import { CreatorProfile } from "src/generated/prisma/client"
import { AccountService } from "../auth/account.service"
import { CreatorInvitesService } from "../creator-invites/creator-invites.service"
import { PrismaService } from "../prisma/prisma.service"
import { PatchOnboardingDto } from "./dto/onboarding.dto"

@Injectable()
export class OnboardingService {
  private readonly logger = new CustomLogger(OnboardingService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly accountService: AccountService,
    private readonly creatorInvitesService: CreatorInvitesService,
    private readonly config: ConfigService
  ) {}

  async getStatus(accountId: string): Promise<OnboardingStatusResponse> {
    const account = await this.prisma.account.findUniqueOrThrow({
      where: { id: accountId },
      include: { creatorProfile: true },
    })

    if (account.accountType !== "creator") {
      throw new ForbiddenException(
        "Only creator accounts can access onboarding."
      )
    }

    return {
      account_state: account.status,
      step: this.resolveResumeStep(account.creatorProfile, account.status),
      profile: this.toProfileData(account.creatorProfile),
    }
  }

  async patchProfile(
    accountId: string,
    body: PatchOnboardingDto
  ): Promise<OnboardingStatusResponse> {
    const account = await this.prisma.account.findUniqueOrThrow({
      where: { id: accountId },
    })

    if (account.accountType !== "creator") {
      throw new ForbiddenException(
        "Only creator accounts can access onboarding."
      )
    }

    if (account.status !== "onboarding") {
      throw new BadRequestException(
        "Onboarding profile can only be updated while account is in onboarding status."
      )
    }

    if (body.studio && body.creator_type !== "studio" && !body.creator_type) {
      const existing = await this.prisma.creatorProfile.findUnique({
        where: { accountId },
      })
      if (existing?.creatorType !== "studio") {
        throw new BadRequestException(
          "Studio details require creator_type to be studio."
        )
      }
    }

    if (body.creator_type === "solo" && body.studio) {
      throw new BadRequestException(
        "Studio details cannot be provided when creator_type is solo."
      )
    }

    const data: Record<string, unknown> = {}

    if (body.step !== undefined) {
      data.onboardingStep = body.step
    }
    if (body.creator_type !== undefined) {
      data.creatorType = body.creator_type
    }
    if (body.content_formats !== undefined) {
      data.contentFormats = body.content_formats
    }
    if (body.get_started_mode !== undefined) {
      data.getStartedMode = body.get_started_mode
    }
    if (body.studio !== undefined && body.studio !== null) {
      if (body.studio.name !== undefined) data.studioName = body.studio.name
      if (body.studio.team_size !== undefined) {
        data.teamSize = body.studio.team_size
      }
      if (body.studio.website !== undefined) {
        data.studioWebsite = body.studio.website
      }
    }

    const profile = await this.prisma.creatorProfile.upsert({
      where: { accountId },
      create: {
        accountId,
        ...data,
      },
      update: data,
    })

    this.logger.log({
      event: "onboarding_profile_updated",
      account_id: accountId,
      step: body.step ?? profile.onboardingStep,
    })

    return this.getStatus(accountId)
  }

  async complete(accountId: string): Promise<CompleteOnboardingResponse> {
    const account = await this.prisma.account.findUniqueOrThrow({
      where: { id: accountId },
      include: { creatorProfile: true },
    })

    if (account.accountType !== "creator") {
      throw new ForbiddenException(
        "Only creator accounts can complete onboarding."
      )
    }

    if (account.status !== "onboarding") {
      throw new BadRequestException(
        "Onboarding can only be completed from onboarding status."
      )
    }

    const displayName =
      account.displayName ??
      ([account.firstName, account.lastName].filter(Boolean).join(" ").trim() ||
        null)

    await this.prisma.$transaction([
      this.prisma.creatorProfile.upsert({
        where: { accountId },
        create: {
          accountId,
          completedAt: new Date(),
          onboardingStep: "get-started",
        },
        update: {
          completedAt: new Date(),
          onboardingStep: "get-started",
        },
      }),
      this.prisma.account.update({
        where: { id: accountId },
        data: { displayName },
      }),
    ])

    const requireApproval = this.creatorRequiresApproval()
    const invited = await this.creatorInvitesService.hasAcceptedInvite(
      account.emailNormalized
    )
    const targetState =
      !requireApproval || invited ? "active" : "pending_approval"

    await this.accountService.transitionStatus({
      account_id: accountId,
      to: targetState,
    })

    this.logger.log({
      event: "onboarding_completed",
      account_id: accountId,
      account_state: targetState,
    })

    return {
      account_state: targetState,
      redirect: "/dashboard",
    }
  }

  private resolveResumeStep(
    profile: CreatorProfile | null,
    accountStatus: string
  ): OnboardingStepId | null {
    if (accountStatus !== "onboarding") return null

    const saved = profile?.onboardingStep as OnboardingStepId | null
    if (saved) return saved

    if (!profile?.creatorType) return "creator-type"
    if (profile.creatorType === "studio" && !profile.studioName) {
      return "studio"
    }
    if (!profile.contentFormats.length) return "content"
    if (!profile.getStartedMode) return "get-started"
    return "get-started"
  }

  private toProfileData(profile: CreatorProfile | null): OnboardingProfileData {
    if (!profile) {
      return {
        creator_type: null,
        studio: null,
        content_formats: [],
        get_started_mode: null,
      }
    }

    const hasStudio =
      profile.studioName || profile.teamSize || profile.studioWebsite

    return {
      creator_type:
        (profile.creatorType as OnboardingProfileData["creator_type"]) ?? null,
      studio: hasStudio
        ? {
            name: profile.studioName ?? undefined,
            team_size:
              (profile.teamSize as OnboardingProfileData["studio"] extends {
                team_size?: infer T
              }
                ? T
                : never) ?? null,
            website: profile.studioWebsite ?? null,
          }
        : null,
      content_formats:
        profile.contentFormats as OnboardingProfileData["content_formats"],
      get_started_mode:
        (profile.getStartedMode as OnboardingProfileData["get_started_mode"]) ??
        null,
    }
  }

  private creatorRequiresApproval(): boolean {
    return (
      this.config.get<string>("CREATOR_REQUIRE_APPROVAL", "false") === "true"
    )
  }
}
