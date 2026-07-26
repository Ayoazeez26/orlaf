import { Module } from "@nestjs/common"
import { AuthModule } from "../auth/auth.module"
import { OptionalJwtAuthGuard } from "../auth/optional-jwt-auth.guard"
import { PlaybackController } from "./playback.controller"
import { PlaybackService } from "./playback.service"

@Module({
  imports: [AuthModule],
  controllers: [PlaybackController],
  providers: [PlaybackService, OptionalJwtAuthGuard],
  exports: [PlaybackService],
})
export class PlaybackModule {}
