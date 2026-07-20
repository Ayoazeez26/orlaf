import { defineConfig, loadEnv } from "vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"

function resolveBackendUrl(mode: string, env: Record<string, string>) {
  const backendUrl = (
    env.VITE_API_BASE_URL ??
    process.env.VITE_API_BASE_URL ??
    "http://localhost:3000"
  ).replace(/\/+$/, "")

  const isProductionBuild = mode === "production" || process.env.VERCEL === "1"
  if (
    isProductionBuild &&
    (backendUrl.includes("localhost") || backendUrl.includes("127.0.0.1"))
  ) {
    throw new Error(
      "VITE_API_BASE_URL must be set to your deployed backend URL for production builds. " +
        "On Vercel, add it under Project Settings → Environment Variables, then redeploy."
    )
  }

  return backendUrl
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const backendUrl = resolveBackendUrl(mode, env)

  return {
    worker: {
      format: "es",
    },
    plugins: [
      nitro({
        routeRules: {
          "/api/**": {
            proxy: `${backendUrl}/api/**`,
          },
        },
      }),
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
    ],
    server: {
      port: 3001,
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          secure: true,
          cookieDomainRewrite: "localhost",
        },
      },
    },
  }
})
