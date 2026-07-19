import { Module } from "@nestjs/common"
import { PrismaModule } from "../prisma/prisma.module"
import { CreatorInvitesController } from "./creator-invites.controller"
import { CreatorInvitesService } from "./creator-invites.service"

@Module({
  imports: [PrismaModule],
  controllers: [CreatorInvitesController],
  providers: [CreatorInvitesService],
  exports: [CreatorInvitesService],
})
export class CreatorInvitesModule {}
