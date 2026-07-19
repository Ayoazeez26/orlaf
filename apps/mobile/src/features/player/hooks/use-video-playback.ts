import { useEvent, useEventListener } from "expo"
import { useVideoPlayer, type VideoPlayer, type VideoSource } from "expo-video"
import { useCallback, useEffect, useRef, useState } from "react"
import { safePause, safePlay, rewindPlaybackFromEnd } from "../../../lib/safe-video-player"
import { PLAYER_FALLBACK_URL } from "../constants"
import { buildVideoSource } from "../utils/build-video-source"

type UseVideoPlaybackOptions = {
  url: string | null
  metadata?: {
    title?: string
    artist?: string
    artwork?: string
  }
  autoPlay?: boolean
  loop?: boolean
}

export function useVideoPlayback({
  url,
  metadata,
  autoPlay = true,
  loop = true,
}: UseVideoPlaybackOptions) {
  const [thumbnailVisible, setThumbnailVisible] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSwitchingSource, setIsSwitchingSource] = useState(false)
  const [duration, setDuration] = useState(0)
  const activeUrlRef = useRef<string | null>(null)

  const player = useVideoPlayer(
    buildVideoSource(PLAYER_FALLBACK_URL),
    (instance) => {
      instance.loop = loop
      instance.timeUpdateEventInterval = 1
      instance.showNowPlayingNotification = false
      instance.preservesPitch = true
    }
  )
  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  const toSource = useCallback(
    (sourceUrl: string): VideoSource => buildVideoSource(sourceUrl, metadata),
    [metadata?.artist, metadata?.artwork, metadata?.title]
  )

  useEffect(() => {
    if (!url) return

    if (activeUrlRef.current === url) return

    let cancelled = false
    activeUrlRef.current = url
    setIsSwitchingSource(true)
    setThumbnailVisible(true)
    setError(null)

    player
      .replaceAsync(toSource(url))
      .then(() => {
        if (cancelled) return
        if (metadata?.title) {
          player.showNowPlayingNotification = true
        }
        if (autoPlay) safePlay(player)
        setThumbnailVisible(false)
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load video")
      })
      .finally(() => {
        if (!cancelled) setIsSwitchingSource(false)
      })

    return () => {
      cancelled = true
    }
  }, [autoPlay, metadata?.title, player, toSource, url])

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  })

  const { currentTime } = useEvent(player, "timeUpdate", {
    currentTime: player.currentTime,
    currentLiveTimestamp: null,
    currentOffsetFromLive: null,
    bufferedPosition: 0,
  })

  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  })

  useEventListener(
    player,
    "statusChange",
    ({ status: nextStatus, error: playerError }) => {
      if (playerError) setError(playerError.message)
      if (nextStatus === "readyToPlay") setError(null)
    }
  )

  useEventListener(player, "sourceLoad", ({ duration: loadedDuration }) => {
    setDuration(loadedDuration)
  })

  useEffect(() => {
    player.loop = loop
  }, [loop, player])

  useEffect(() => {
    if (isPlaying) setThumbnailVisible(false)
  }, [isPlaying])

  const isBuffering =
    isSwitchingSource || (status === "loading" && !thumbnailVisible && !error)

  const play = useCallback(() => {
    safePlay(player)
    setThumbnailVisible(false)
  }, [player])

  const pause = useCallback(() => {
    safePause(player)
  }, [player])

  const rewindFromEnd = useCallback(() => {
    rewindPlaybackFromEnd(player)
  }, [player])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  const retry = useCallback(() => {
    const currentUrl = activeUrlRef.current ?? url ?? PLAYER_FALLBACK_URL
    setError(null)
    setThumbnailVisible(true)
    setIsSwitchingSource(true)
    player
      .replaceAsync(toSource(currentUrl))
      .then(() => {
        if (autoPlay) safePlay(player)
        setThumbnailVisible(false)
      })
      .catch(() => setError("Unable to load video"))
      .finally(() => setIsSwitchingSource(false))
  }, [autoPlay, player, url])

  const onFirstFrame = useCallback(() => setThumbnailVisible(false), [])

  const pauseOnUnmount = useCallback(() => safePause(player), [player])

  return {
    player,
    isPlaying,
    currentTime,
    duration,
    status,
    error,
    thumbnailVisible,
    isBuffering,
    isSwitchingSource,
    play,
    pause,
    rewindFromEnd,
    retry,
    onFirstFrame,
    pauseOnUnmount,
  }
}

export type VideoPlaybackController = ReturnType<typeof useVideoPlayback> & {
  player: VideoPlayer
}
