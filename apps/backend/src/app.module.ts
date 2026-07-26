import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AdminModule } from "./admin/admin.module"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthModule } from "./auth/auth.module"
import { CatalogModule } from "./catalog/catalog.module"
import { CreatorInvitesModule } from "./creator-invites/creator-invites.module"
import { CreatorsModule } from "./creators/creators.module"
import { EngagementModule } from "./engagement/engagement.module"
import { LibraryModule } from "./library/library.module"
import { PlaybackModule } from "./playback/playback.module"
import { PrismaModule } from "./prisma/prisma.module"
import { ProfileModule } from "./profile/profile.module"
import { StudioModule } from "./studio/studio.module"
import { UsersModule } from "./users/users.module"
import { WebhookModule } from "./webhooks/webhook.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    PrismaModule,
    AuthModule,
    CatalogModule,
    AdminModule,
    CreatorInvitesModule,
    CreatorsModule,
    UsersModule,
    StudioModule,
    WebhookModule,
    ProfileModule,
    LibraryModule,
    EngagementModule,
    PlaybackModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
