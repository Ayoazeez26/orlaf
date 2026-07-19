import { execSync } from "node:child_process"
import { existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const monorepoRoot = join(root, "../..")
const loggerDist = join(monorepoRoot, "packages/logger/dist/index.js")

if (!existsSync(loggerDist)) {
  console.log("[@orlaf/backend] Building @sable/logger...")
  execSync("pnpm --filter @sable/logger build", {
    cwd: monorepoRoot,
    stdio: "inherit",
  })
}

if (!process.env.DATABASE_URL) {
  console.log(
    "[@orlaf/backend] Skipping prisma generate (DATABASE_URL is not set)"
  )
  process.exit(0)
}

console.log("[@orlaf/backend] Generating Prisma client...")
execSync("prisma generate", { cwd: root, stdio: "inherit" })
