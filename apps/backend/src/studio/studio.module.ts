import { Module } from "@nestjs/common"
import { VIDEO_HOSTING_PROVIDER } from "@sable/contracts"
import { CloudflareStreamProvider } from "src/providers/cloudflare-stream.provider"
import { R2StorageProvider } from "src/providers/r2-storage.provider"
import { EpisodeService } from "./episode.service"
import { SeriesService } from "./series.service"
import { StudioController } from "./studio.controller"
import { StudioPublicController } from "./studio-public.controller"

/**
 * StudioModule — creator studio features.
 *
 * Video hosting provider swap:
 *   1. Implement IVideoHostingProvider in a new class
 *   2. Change useClass below to the new provider
 *   3. No other changes needed
 *
 * Env vars:
 *   CLOUDFLARE_ACCOUNT_ID           — Cloudflare account ID
 *   CLOUDFLARE_STREAM_API_TOKEN     — Cloudflare Stream API token
 *   CLOUDFLARE_R2_ACCOUNT_ID        — R2 account ID (usually same as above)
 *   CLOUDFLARE_R2_ACCESS_KEY_ID     — R2 API token access key
 *   CLOUDFLARE_R2_SECRET_ACCESS_KEY — R2 API token secret key
 *   CLOUDFLARE_R2_BUCKET_NAME       — R2 bucket name (e.g. sable-media)
 *   CLOUDFLARE_R2_PUBLIC_URL        — Public URL for R2 bucket (e.g. https://media.sable.tv)
 */
@Module({
  controllers: [StudioController, StudioPublicController],
  providers: [
    SeriesService,
    EpisodeService,
    R2StorageProvider,
    {
      provide: VIDEO_HOSTING_PROVIDER,
      useClass: CloudflareStreamProvider,
    },
  ],
  exports: [
    SeriesService,
    EpisodeService,
    R2StorageProvider,
    VIDEO_HOSTING_PROVIDER,
  ],
})
export class StudioModule {}
