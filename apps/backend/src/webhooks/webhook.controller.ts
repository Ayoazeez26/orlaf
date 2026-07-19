import { createHmac, timingSafeEqual } from "node:crypto"
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { CustomLogger } from "@sable/logger"
import type { Request } from "express"
import { CloudflareWebhookDto } from "src/studio/dto/cloudfare.dto"
import { EpisodeService } from "../studio/episode.service"

@ApiTags("Webhooks")
@Controller("webhooks")
export class WebhookController {
  private readonly logger = new CustomLogger(WebhookController.name)

  constructor(
    private readonly episodeService: EpisodeService,
    private readonly config: ConfigService
  ) {}

  // ---------------------------------------------------------------------------
  // POST /webhooks/cloudflare-stream
  // ---------------------------------------------------------------------------

  @Post("cloudflare-stream")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Cloudflare Stream webhook",
    description:
      "Called by Cloudflare when video transcoding completes or fails. Verified via HMAC-SHA256 signature.",
  })
  async cloudflareStreamWebhook(
    @Headers("webhook-signature") signatureHeader: string,
    @Body() payload: CloudflareWebhookDto,
    @Req() req: Request
  ) {
    if (!this.verifySignature(signatureHeader, JSON.stringify(req.body))) {
      this.logger.warn({ event: "cloudflare_webhook_invalid_signature" })
      throw new UnauthorizedException("Invalid webhook signature")
    }

    await this.episodeService.handleVideoWebhook(payload)
    return { ok: true }
  }

  // ---------------------------------------------------------------------------
  // Signature verification
  // Docs: https://developers.cloudflare.com/stream/manage-video-library/using-webhooks/
  // ---------------------------------------------------------------------------

  private verifySignature(signatureHeader: string, body: string): boolean {
    const secret = this.config.get<string>("CLOUDFLARE_WEBHOOK_SECRET", "")

    // If secret not configured, skip verification (dev mode)
    if (!secret) {
      this.logger.warn({
        event: "cloudflare_webhook_signature_skipped",
        reason: "CLOUDFLARE_WEBHOOK_SECRET not set",
      })
      return true
    }

    if (!signatureHeader) return false

    // Parse header: "time=1230811200,sig1=abc123..."
    const parts: Record<string, string> = {}
    for (const part of signatureHeader.split(",")) {
      const [key, ...rest] = part.split("=")
      parts[key] = rest.join("=")
    }

    const time = parts.time
    const sig1 = parts.sig1

    if (!time || !sig1) return false

    // Reject requests older than 5 minutes
    const requestTime = parseInt(time, 10)
    const now = Math.floor(Date.now() / 1000)
    if (Math.abs(now - requestTime) > 300) {
      this.logger.warn({
        event: "cloudflare_webhook_expired",
        request_time: requestTime,
        now,
      })
      return false
    }

    // Compute expected signature: HMAC-SHA256(secret, "time.body")
    const source = `${time}.${body}`
    const expected = createHmac("sha256", secret).update(source).digest("hex")

    try {
      return timingSafeEqual(
        Buffer.from(sig1, "hex"),
        Buffer.from(expected, "hex")
      )
    } catch {
      return false
    }
  }
}
