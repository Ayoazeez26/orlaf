import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import {
  CreateImageUploadResult,
  CreateVideoResult,
  IVideoHostingProvider,
  VideoMetadata,
} from "@sable/contracts"
import { R2StorageProvider } from "./r2-storage.provider"

// TODO(KAN-53): attach W3C traceparent to outgoing Cloudflare API requests

@Injectable()
export class CloudflareStreamProvider implements IVideoHostingProvider {
  private readonly logger = new Logger(CloudflareStreamProvider.name)
  private readonly accountId: string
  private readonly apiToken: string
  private readonly baseUrl: string

  constructor(
    private readonly config: ConfigService,
    private readonly r2: R2StorageProvider
  ) {
    this.accountId = this.config.get<string>("CLOUDFLARE_ACCOUNT_ID", "")
    this.apiToken = this.config.get<string>("CLOUDFLARE_STREAM_API_TOKEN", "")
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/stream`
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.apiToken}`,
      "Content-Type": "application/json",
    }
  }

  // ---------------------------------------------------------------------------
  // createVideo — episodes and trailers
  // ---------------------------------------------------------------------------

  async createVideo(input: {
    title: string
    creatorId: string
  }): Promise<CreateVideoResult> {
    this.logger.log({
      event: "cloudflare_create_video",
      title: input.title,
      creator_id: input.creatorId,
    })

    const response = await fetch(`${this.baseUrl}/direct_upload`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        maxDurationSeconds: 3600,
        expiry: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        meta: {
          name: input.title,
          creatorId: input.creatorId,
        },
        requireSignedURLs: false,
      }),
    })

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      this.logger.error({
        event: "cloudflare_create_video_failed",
        status: response.status,
        body,
      })
      throw new Error(
        `Cloudflare Stream: failed to create video (${response.status})`
      )
    }

    const data = await response.json()
    const result = data.result

    return {
      videoId: result.uid,
      uploadUrl: result.uploadURL,
      hlsUrl: null,
    }
  }

  // ---------------------------------------------------------------------------
  // getVideoMetadata
  // ---------------------------------------------------------------------------

  async getVideoMetadata(videoId: string): Promise<VideoMetadata> {
    const response = await fetch(`${this.baseUrl}/${videoId}`, {
      headers: this.headers,
    })

    if (!response.ok) {
      throw new Error(
        `Cloudflare Stream: failed to get video metadata (${response.status})`
      )
    }

    const data = await response.json()
    const result = data.result

    const stateMap: Record<string, VideoMetadata["status"]> = {
      pendingupload: "pending",
      downloading: "processing",
      queued: "processing",
      inprogress: "processing",
      ready: "ready",
      error: "failed",
    }

    const rawState =
      typeof result.status === "object" && result.status !== null
        ? String(result.status.state ?? "").toLowerCase()
        : String(result.status ?? "").toLowerCase()

    let status = stateMap[rawState] ?? "processing"

    // Cloudflare can expose playback URLs while status.state is still
    // "inprogress". readyToStream means at least one quality is playable.
    if (result.readyToStream === true && result.playback?.hls) {
      status = "ready"
    }

    return {
      hlsUrl: result.playback?.hls ?? null,
      dashUrl: result.playback?.dash ?? null,
      thumbnailUrl: result.thumbnail ?? null,
      durationSeconds: result.duration ?? null,
      width: result.input?.width ?? null,
      height: result.input?.height ?? null,
      status,
    }
  }

  // ---------------------------------------------------------------------------
  // deleteVideo
  // ---------------------------------------------------------------------------

  async deleteVideo(videoId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${videoId}`, {
      method: "DELETE",
      headers: this.headers,
    })

    if (!response.ok && response.status !== 404) {
      throw new Error(
        `Cloudflare Stream: failed to delete video (${response.status})`
      )
    }

    this.logger.log({ event: "cloudflare_video_deleted", video_id: videoId })
  }

  // ---------------------------------------------------------------------------
  // getSignedPlaybackUrl
  // ---------------------------------------------------------------------------

  async getSignedPlaybackUrl(
    videoId: string,
    _expiresInSeconds = 3600
  ): Promise<string> {
    // TODO: implement signed URL generation using Cloudflare Stream signing keys
    const metadata = await this.getVideoMetadata(videoId)
    return (
      metadata.hlsUrl ??
      `https://customer-${this.accountId}.cloudflarestream.com/${videoId}/manifest/video.m3u8`
    )
  }

  // ---------------------------------------------------------------------------
  // createImageUploadUrl — delegates to R2
  // ---------------------------------------------------------------------------

  async createImageUploadUrl(input: {
    creatorId: string
    contentType: string
  }): Promise<CreateImageUploadResult> {
    return this.r2.createPosterUploadUrl(input.creatorId, input.contentType)
  }
}
