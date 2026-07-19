import { Module } from "@nestjs/common"
import { StudioModule } from "../studio/studio.module"
import { WebhookController } from "./webhook.controller"

/**
 * WebhookModule — handles all inbound webhooks from external providers.
 *
 * Current webhooks:
 *   POST /api/v1/webhooks/cloudflare-stream — Cloudflare Stream transcode events
 *
 * Env vars:
 *   CLOUDFLARE_WEBHOOK_SECRET — from Cloudflare API when registering the webhook URL
 *                               Leave empty to skip signature verification in dev
 */
@Module({
  imports: [StudioModule],
  controllers: [WebhookController],
})
export class WebhookModule {}
