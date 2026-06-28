import { defineConfig, loadEnv } from "vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const backendUrl = (
    env.VITE_API_BASE_URL ?? "http://localhost:3000"
  ).replace(/\/+$/, "")

  return {
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
