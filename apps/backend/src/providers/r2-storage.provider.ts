import { createHash, createHmac } from "node:crypto"
import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

/**
 * R2StorageProvider — Cloudflare R2 presigned URL generation.
 *
 * R2 is S3-compatible so we use AWS Signature V4 to generate presigned PUT URLs.
 * No AWS SDK needed — pure crypto implementation.
 *
 * Env vars:
 *   CLOUDFLARE_R2_ACCOUNT_ID       — Cloudflare account ID
 *   CLOUDFLARE_R2_ACCESS_KEY_ID    — R2 API token access key
 *   CLOUDFLARE_R2_SECRET_ACCESS_KEY — R2 API token secret key
 *   CLOUDFLARE_R2_BUCKET_NAME      — R2 bucket name (e.g. sable-media)
 *   CLOUDFLARE_R2_PUBLIC_URL       — Public base URL (e.g. https://media.sable.tv)
 */
@Injectable()
export class R2StorageProvider {
  private readonly logger = new Logger(R2StorageProvider.name)
  private readonly accountId: string
  private readonly accessKeyId: string
  private readonly secretAccessKey: string
  private readonly bucketName: string
  private readonly publicUrl: string
  private readonly endpoint: string

  constructor(private readonly config: ConfigService) {
    this.accountId = this.config.get<string>("CLOUDFLARE_R2_ACCOUNT_ID", "")
    this.accessKeyId = this.config.get<string>(
      "CLOUDFLARE_R2_ACCESS_KEY_ID",
      ""
    )
    this.secretAccessKey = this.config.get<string>(
      "CLOUDFLARE_R2_SECRET_ACCESS_KEY",
      ""
    )
    this.bucketName = this.config.get<string>(
      "CLOUDFLARE_R2_BUCKET_NAME",
      "sable-media"
    )
    this.publicUrl = this.config.get<string>("CLOUDFLARE_R2_PUBLIC_URL", "")
    this.endpoint = `https://${this.accountId}.r2.cloudflarestorage.com`
  }

  // ---------------------------------------------------------------------------
  // Create presigned PUT URL for image upload
  // ---------------------------------------------------------------------------

  async createPresignedUploadUrl(input: {
    key: string // e.g. "posters/creator_123/series_abc.jpg"
    contentType: string // e.g. "image/jpeg"
    expiresInSeconds?: number
  }): Promise<{ uploadUrl: string; publicUrl: string }> {
    const { key, contentType, expiresInSeconds = 3600 } = input

    const now = new Date()
    const dateStamp = this.formatDate(now) // YYYYMMDD
    const amzDate = this.formatAmzDate(now) // YYYYMMDDTHHMMSSZ

    const region = "auto"
    const service = "s3"
    const host = `${this.accountId}.r2.cloudflarestorage.com`
    const url = `${this.endpoint}/${this.bucketName}/${key}`

    const credential = `${this.accessKeyId}/${dateStamp}/${region}/${service}/aws4_request`

    const queryParams = new URLSearchParams({
      "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
      "X-Amz-Credential": credential,
      "X-Amz-Date": amzDate,
      "X-Amz-Expires": String(expiresInSeconds),
      "X-Amz-SignedHeaders": "content-type;host",
    })

    const canonicalRequest = [
      "PUT",
      `/${this.bucketName}/${key}`,
      queryParams.toString(),
      `content-type:${contentType}\nhost:${host}\n`,
      "content-type;host",
      "UNSIGNED-PAYLOAD",
    ].join("\n")

    const stringToSign = [
      "AWS4-HMAC-SHA256",
      amzDate,
      `${dateStamp}/${region}/${service}/aws4_request`,
      createHash("sha256").update(canonicalRequest).digest("hex"),
    ].join("\n")

    const signingKey = this.getSigningKey(dateStamp, region, service)
    const signature = createHmac("sha256", signingKey)
      .update(stringToSign)
      .digest("hex")

    const signedUrl = `${url}?${queryParams.toString()}&X-Amz-Signature=${signature}`

    const publicFileUrl = this.publicUrl
      ? `${this.publicUrl}/${key}`
      : `${this.endpoint}/${this.bucketName}/${key}`

    this.logger.log({
      event: "r2_presigned_url_created",
      key,
      content_type: contentType,
    })

    return {
      uploadUrl: signedUrl,
      publicUrl: publicFileUrl,
    }
  }

  // ---------------------------------------------------------------------------
  // Generate upload URL for series poster
  // ---------------------------------------------------------------------------

  async createPosterUploadUrl(
    creatorId: string,
    contentType: string
  ): Promise<{ uploadUrl: string; imageUrl: string }> {
    const ext = contentType.split("/")[1] ?? "jpeg"
    const key = `posters/${creatorId}/${Date.now()}.${ext}`
    const { uploadUrl, publicUrl } = await this.createPresignedUploadUrl({
      key,
      contentType,
    })
    return { uploadUrl, imageUrl: publicUrl }
  }

  // ---------------------------------------------------------------------------
  // Generate upload URL for episode thumbnail
  // ---------------------------------------------------------------------------

  async createThumbnailUploadUrl(
    creatorId: string,
    episodeId: string
  ): Promise<{
    uploadUrl: string
    imageUrl: string
  }> {
    const key = `thumbnails/${creatorId}/${episodeId}-${Date.now()}.jpg`
    const { uploadUrl, publicUrl } = await this.createPresignedUploadUrl({
      key,
      contentType: "image/jpeg",
    })
    return { uploadUrl, imageUrl: publicUrl }
  }

  // ---------------------------------------------------------------------------
  // Delete object from R2
  // ---------------------------------------------------------------------------

  async deleteObject(key: string): Promise<void> {
    const now = new Date()
    const dateStamp = this.formatDate(now)
    const amzDate = this.formatAmzDate(now)

    const region = "auto"
    const service = "s3"
    const host = `${this.accountId}.r2.cloudflarestorage.com`
    const url = `${this.endpoint}/${this.bucketName}/${key}`

    const canonicalRequest = [
      "DELETE",
      `/${this.bucketName}/${key}`,
      "",
      `host:${host}\nx-amz-date:${amzDate}\n`,
      "host;x-amz-date",
      createHash("sha256").update("").digest("hex"),
    ].join("\n")

    const stringToSign = [
      "AWS4-HMAC-SHA256",
      amzDate,
      `${dateStamp}/${region}/${service}/aws4_request`,
      createHash("sha256").update(canonicalRequest).digest("hex"),
    ].join("\n")

    const signingKey = this.getSigningKey(dateStamp, region, service)
    const signature = createHmac("sha256", signingKey)
      .update(stringToSign)
      .digest("hex")

    const headers = {
      host,
      "x-amz-date": amzDate,
      Authorization: `AWS4-HMAC-SHA256 Credential=${this.accessKeyId}/${dateStamp}/${region}/${service}/aws4_request, SignedHeaders=host;x-amz-date, Signature=${signature}`,
    }

    const response = await fetch(url, { method: "DELETE", headers })

    if (!response.ok && response.status !== 404) {
      throw new Error(`R2: failed to delete object (${response.status})`)
    }

    this.logger.log({ event: "r2_object_deleted", key })
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private getSigningKey(
    dateStamp: string,
    region: string,
    service: string
  ): Buffer {
    const kDate = createHmac("sha256", `AWS4${this.secretAccessKey}`)
      .update(dateStamp)
      .digest()
    const kRegion = createHmac("sha256", kDate).update(region).digest()
    const kService = createHmac("sha256", kRegion).update(service).digest()
    return createHmac("sha256", kService).update("aws4_request").digest()
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10).replace(/-/g, "")
  }

  private formatAmzDate(date: Date): string {
    return `${date.toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`
  }
}
