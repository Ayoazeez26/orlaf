import { Module } from "@nestjs/common"
import { AuthModule } from "../auth/auth.module"
import { OptionalJwtAuthGuard } from "../auth/optional-jwt-auth.guard"
import { EngagementController } from "./engagement.controller"
import { EngagementService } from "./engagement.service"

@Module({
  imports: [AuthModule],
  controllers: [EngagementController],
  providers: [EngagementService, OptionalJwtAuthGuard],
  exports: [EngagementService],
})
export class EngagementModule {}
