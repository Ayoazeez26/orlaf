import { Module } from "@nestjs/common"
import { StudioModule } from "../studio/studio.module"
import { ArchiveService } from "./archive.service"
import { ProfileController } from "./profile.controller"
import { ProfileService } from "./profile.service"

/**
 * ProfileModule — creator and user profile management.
 *
 * Endpoints:
 *   GET    /api/v1/profile/me              — get full profile
 *   PATCH  /api/v1/profile/me              — update personal info
 *   PATCH  /api/v1/profile/me/social       — update social links
 *   POST   /api/v1/profile/me/avatar-url   — get signed URL for avatar upload
 *   PATCH  /api/v1/profile/studio          — update studio info (creator only)
 *   POST   /api/v1/profile/studio/logo-url — get signed URL for studio logo upload
 */
@Module({
  imports: [StudioModule],
  controllers: [ProfileController],
  providers: [ProfileService, ArchiveService],
  exports: [ProfileService, ArchiveService],
})
export class ProfileModule {}
