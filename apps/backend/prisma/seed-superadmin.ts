import "dotenv/config"
import { createPrismaClient } from "../src/prisma/create-prisma-client"
import { AccountService } from "../src/auth/account.service"
import { seedSuperAdmin } from "../src/auth/seed-superadmin"
import type { PrismaService } from "../src/prisma/prisma.service"

async function main() {
  const email = process.env.SUPERADMIN_EMAIL
  if (!email) {
    throw new Error("SUPERADMIN_EMAIL is required")
  }

  const prisma = createPrismaClient()
  const accountService = new AccountService(prisma as unknown as PrismaService)

  try {
    const result = await seedSuperAdmin(accountService, {
      email,
      password: process.env.SUPERADMIN_PASSWORD,
    })

    if (!result.created) {
      console.log(`Super admin already exists for ${result.email} (${result.accountId})`)
      return
    }

    console.log(`Super admin created for ${result.email} (${result.accountId})`)
    if (result.generatedPassword) {
      console.log("Generated temp password (change on first login):")
      console.log(result.generatedPassword)
    }
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
