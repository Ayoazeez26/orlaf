import "dotenv/config"
import { createPrismaClient } from "../src/prisma/create-prisma-client"
import { SERIES_GENRES } from "@sable/contracts"

const prisma = createPrismaClient()

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

async function main() {
  for (const [index, name] of SERIES_GENRES.entries()) {
    await prisma.genre.upsert({
      where: { name },
      update: {
        sortOrder: index + 1,
        isActive: true,
      },
      create: {
        id: `genre_${slugify(name)}`,
        name,
        slug: slugify(name),
        sortOrder: index + 1,
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
