import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client"

export function createPrismaClientOptions() {
  return {
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    }),
  }
}

export function createPrismaClient() {
  return new PrismaClient(createPrismaClientOptions())
}
