import { cn } from "@workspace/ui/lib/utils"
import Hls from "hls.js"
import { Pause, Play, Volume2, VolumeX } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface UseMediaPreviewPlayerOptions {
  src: string
  autoPlay?: boolean
}

export function useMediaPreviewPlayer({
  src,
  autoPlay = true,
}: UseMediaPreviewPlayerOptions) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [playing, setPlaying] = useState(autoPlay)
  const [muted, setMuted] = useState(true)
  const [volume, setVolume] = useState(1)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    hlsRef.current?.destroy()
    hlsRef.current = null
    if (!video || !src) return

    let disposed = false
    const isHlsSource = src.includes(".m3u8")

    const startPlayback = () => {
      if (!autoPlay) return
      video
        .play()
        .then(() => {
          if (!disposed) setPlaying(true)
        })
        .catch(() => {
          if (!disposed) setPlaying(false)
        })
    }

    if (isHlsSource && video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src
      startPlayback()
    } else if (isHlsSource && Hls.isSupported()) {
      const hls = new Hls()
      hlsRef.current = hls
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!disposed) startPlayback()
      })
    } else {
      video.src = src
      startPlayback()
    }

    return () => {
      disposed = true
      hlsRef.current?.destroy()
      hlsRef.current = null
    }
  }, [src, autoPlay])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = muted
    video.volume = volume
  }, [muted, volume])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setProgress(video.duration ? video.currentTime / video.duration : 0)
    }
    const handleLoadedMetadata = () => setDuration(video.duration || 0)
    const handleEnded = () => setPlaying(false)

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("ended", handleEnded)
    }
  }, [])

  function togglePlayback() {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  function toggleMute() {
    setMuted((current) => !current)
  }

  function seekToPercent(percent: number) {
    const video = videoRef.current
    if (!video?.duration) return
    video.currentTime = Math.min(Math.max(percent, 0), 1) * video.duration
  }

  return {
    videoRef,
    playing,
    togglePlayback,
    muted,
    toggleMute,
    volume,
    setVolume,
    progress,
    duration,
    seekToPercent,
  }
}

interface MediaPreviewVideoLayerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  posterUrl?: string | null
  className?: string
}

export function MediaPreviewVideoLayer({
  videoRef,
  posterUrl,
  className,
}: MediaPreviewVideoLayerProps) {
  return (
    // biome-ignore lint/a11y/useMediaCaption: muted decorative mobile preview mockup, no caption source available
    <video
      ref={videoRef}
      className={cn("absolute inset-0 size-full object-cover", className)}
      poster={posterUrl ?? undefined}
      playsInline
      loop
    />
  )
}

interface MediaPreviewPlayPauseButtonProps {
  playing: boolean
  onToggle: () => void
  className?: string
}

export function MediaPreviewPlayPauseButton({
  playing,
  onToggle,
  className,
}: MediaPreviewPlayPauseButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex size-11 items-center justify-center rounded-full bg-primary shadow-[0_8px_20px_rgba(124,58,237,0.35)]",
        className
      )}
      aria-label={playing ? "Pause" : "Play"}
    >
      {playing ? (
        <Pause className="size-5 fill-current text-white" aria-hidden />
      ) : (
        <Play className="ml-0.5 size-5 fill-current text-white" aria-hidden />
      )}
    </button>
  )
}

interface MediaPreviewVolumeControlProps {
  muted: boolean
  volume: number
  onToggleMute: () => void
  onVolumeChange: (volume: number) => void
  className?: string
}

export function MediaPreviewVolumeControl({
  muted,
  volume,
  onToggleMute,
  onVolumeChange,
  className,
}: MediaPreviewVolumeControlProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <button
        type="button"
        onClick={onToggleMute}
        className="flex size-8 items-center justify-center rounded-full bg-white/15 text-white"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted || volume === 0 ? (
          <VolumeX className="size-4" aria-hidden />
        ) : (
          <Volume2 className="size-4" aria-hidden />
        )}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={muted ? 0 : volume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        className="h-1 w-14 cursor-pointer accent-primary"
        aria-label="Volume"
      />
    </div>
  )
}
