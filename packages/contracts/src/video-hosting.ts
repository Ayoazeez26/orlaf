/**
 * VideoHostingProvider — provider-agnostic interface for video hosting.
 *
 * Current implementation: Cloudflare Stream
 * Swap by implementing this interface with a new class and updating
 * the DI binding in studio.module.ts.
 */

export interface CreateVideoResult {
    /** Provider-specific video ID — stored on Episode.videoHostingId */
    videoId: string
    /** URL to upload the raw video file to (tus or direct) */
    uploadUrl: string
    /** HLS playback URL — null until transcode completes */
    hlsUrl: string | null
}

export interface VideoMetadata {
    hlsUrl: string | null
    dashUrl: string | null
    thumbnailUrl: string | null
    durationSeconds: number | null
    width: number | null
    height: number | null
    /** Original upload size in bytes, when the provider reports it. */
    fileSizeBytes: number | null
    status: "pending" | "processing" | "ready" | "failed"
}

export interface CreateImageUploadResult {
    /** Presigned URL to PUT the image to */
    uploadUrl: string
    /** Public URL to store as posterUrl/thumbnailUrl */
    imageUrl: string
}

export interface IVideoHostingProvider {
    /**
     * Create a new video entry and get an upload URL.
     * Used for both episodes and trailers.
     */
    createVideo(input: {
        title: string
        creatorId: string
    }): Promise<CreateVideoResult>

    /**
     * Get current metadata for a video after upload/transcode.
     */
    getVideoMetadata(videoId: string): Promise<VideoMetadata>

    /**
     * Delete a video from the provider.
     */
    deleteVideo(videoId: string): Promise<void>

    /**
     * Generate a signed playback URL for private/coin-gated content.
     * Returns the original URL if signing is not supported/needed.
     */
    getSignedPlaybackUrl(videoId: string, expiresInSeconds?: number): Promise<string>

    /**
     * Get a presigned URL for uploading a static image (poster, thumbnail).
     * Implemented via Cloudflare R2.
     */
    createImageUploadUrl(input: {
        creatorId: string
        contentType: string
    }): Promise<CreateImageUploadResult>
}

export const VIDEO_HOSTING_PROVIDER = "VIDEO_HOSTING_PROVIDER"