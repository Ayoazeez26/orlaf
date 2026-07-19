import type { VideoMetadata, VideoSource } from "expo-video"

export function buildVideoSource(
  url: string,
  metadata?: VideoMetadata
): VideoSource {
  const isHls = /\.m3u8($|\?)/i.test(url) || url.includes("/manifest/")

  return {
    uri: url,
    contentType: isHls ? "hls" : "auto",
    ...(metadata ? { metadata } : {}),
  }
}
