import { Module } from "@nestjs/common"
import { AuthModule } from "../auth/auth.module"
import { CreatorInvitesModule } from "../creator-invites/creator-invites.module"
import { PrismaModule } from "../prisma/prisma.module"
import { OnboardingController } from "./onboarding.controller"
import { OnboardingService } from "./onboarding.service"

@Module({
  imports: [PrismaModule, AuthModule, CreatorInvitesModule],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class CreatorsModule {}
