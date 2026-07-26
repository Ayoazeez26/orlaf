import { Module } from "@nestjs/common"
import { AuthModule } from "../auth/auth.module"
import { EmailModule } from "../email/email.module"
import { PrismaModule } from "../prisma/prisma.module"
import { AdminAnalyticsController } from "./admin-analytics.controller"
import { AdminAnalyticsService } from "./admin-analytics.service"
import { AdminCreatorsController } from "./admin-creators.controller"
import { AdminCreatorsService } from "./admin-creators.service"
import { AdminOnboardingController } from "./admin-onboarding.controller"
import { AdminOnboardingService } from "./admin-onboarding.service"
import { AdminSeriesController } from "./admin-series.controller"
import { AdminSeriesService } from "./admin-series.service"

@Module({
  imports: [PrismaModule, AuthModule, EmailModule],
  controllers: [
    AdminAnalyticsController,
    AdminCreatorsController,
    AdminOnboardingController,
    AdminSeriesController,
  ],
  providers: [
    AdminAnalyticsService,
    AdminCreatorsService,
    AdminOnboardingService,
    AdminSeriesService,
  ],
})
export class AdminModule {}
