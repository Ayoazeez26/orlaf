import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common"
import { PrismaClient } from "../generated/prisma/client"
import { createPrismaClientOptions } from "./create-prisma-client"

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name)

  constructor() {
    super(createPrismaClientOptions())
  }

  async onModuleInit() {
    try {
      await this.$connect()
      this.logger.log("✅ Database connected successfully")
    } catch (error) {
      this.logger.error("❌ Failed to connect to database", error)
      throw error // This will prevent app startup
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
    this.logger.log("🔌 Database disconnected")
  }
}
