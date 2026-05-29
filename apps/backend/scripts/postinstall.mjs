import { execSync } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

if (!process.env.DATABASE_URL) {
  console.log(
    "[@orlaf/backend] Skipping prisma generate (DATABASE_URL is not set)"
  )
  process.exit(0)
}

execSync("prisma generate", { cwd: root, stdio: "inherit" })
