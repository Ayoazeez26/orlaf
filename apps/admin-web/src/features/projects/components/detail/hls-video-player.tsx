import { cn } from "@workspace/ui/lib/utils"
import Hls from "hls.js"
import { useEffect, useRef } from "react"

interface HlsVideoPlayerProps {
  src: string
  className?: string
  autoPlay?: boolean
  /** Fatal playback failure, e.g. the signed URL expired. */
  onFatalError?: () => void
}

/**
 * Plays an HLS manifest with native controls, so reviewers can scrub, change
 * speed and go fullscreen. Safari plays HLS natively; elsewhere hls.js does.
 */
export function HlsVideoPlayer({
  src,
  className,
  autoPlay = true,
  onFatalError,
}: HlsVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const onFatalErrorRef = useRef(onFatalError)
  onFatalErrorRef.current = onFatalError

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src
      return () => {
        video.removeAttribute("src")
        video.load()
      }
    }

    if (!Hls.isSupported()) {
      onFatalErrorRef.current?.()
      return
    }

    const hls = new Hls()
    hls.on(Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) onFatalErrorRef.current?.()
    })
    hls.loadSource(src)
    hls.attachMedia(video)

    return () => hls.destroy()
  }, [src])

  return (
    // biome-ignore lint/a11y/useMediaCaption: creator uploads have no caption tracks
    <video
      ref={videoRef}
      className={cn("size-full bg-black object-contain", className)}
      controls
      playsInline
      autoPlay={autoPlay}
      onError={() => onFatalErrorRef.current?.()}
    />
  )
}
