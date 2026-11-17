/**
 * VideoHostingProvider — provider-agnostic interface for video hosting.
 *
 * Current implementation: Cloudflare Stream
 * Swap by implementing this interface with a new class and updating
 * the DI binding in studio.module.ts.
 */

export type VideoUploadProtocol = "tus" | "basic"

export interface CreateVideoResult {
    /** Provider-specific video ID — stored on Episode.videoHostingId */
    videoId: string
    /** URL to upload the raw video file to (tus or direct) */
    uploadUrl: string
    /**
     * `tus` — resumable upload; the client PATCHes chunks to `uploadUrl`.
     * `basic` — one multipart POST (Cloudflare caps these at 200 MB).
     */
    protocol: VideoUploadProtocol
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

export interface VideoCaption {
    /** BCP 47 language tag, e.g. "en". */
    language: string
    /** Human-readable name the player shows, e.g. "English". */
    label: string
    /** True when the provider's AI generated it; false for uploaded files. */
    generated: boolean
    /** For generated captions: still being made, done, or failed. */
    status: "inprogress" | "ready" | "error"
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
        /**
         * Size of the file in bytes. When set, the provider returns a
         * resumable (tus) upload URL; otherwise a one-shot basic upload URL.
         */
        uploadLength?: number
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
     * Ask the provider to transcribe the video's audio into captions in
     * `language` (BCP 47). Resolves to "exists" when that language already
     * has a caption track.
     */
    generateCaptions(videoId: string, language: string): Promise<"requested" | "exists">

    /** Add or replace the caption track for `language` with a WebVTT file. */
    uploadCaptions(videoId: string, language: string, vtt: string): Promise<void>

    /** Caption tracks attached to a video. */
    listCaptions(videoId: string): Promise<VideoCaption[]>

    /** Remove the caption track for `language`. */
    deleteCaptions(videoId: string, language: string): Promise<void>

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