import { useFocusEffect } from "expo-router"
import { useCallback, useRef, useState } from "react"
import { consumeLastUnlockedEpisode } from "../../episode-unlock/session"

type UsePlayerChromeOptions = {
  isPlaying: boolean
  onResume: () => void
  onPause: () => void
  onUnlockedEpisode?: (episodeId: string) => void
}

export function usePlayerChrome({
  isPlaying,
  onResume,
  onPause,
  onUnlockedEpisode,
}: UsePlayerChromeOptions) {
  const [controlsVisible, setControlsVisible] = useState(true)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearHideTimer = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
  }, [])

  const startHideTimer = useCallback(() => {
    clearHideTimer()
    hideTimeoutRef.current = setTimeout(() => setControlsVisible(false), 3000)
  }, [clearHideTimer])

  const play = useCallback(() => {
    onResume()
    setControlsVisible(true)
    startHideTimer()
  }, [onResume, startHideTimer])

  const pause = useCallback(() => {
    onPause()
    setControlsVisible(true)
    clearHideTimer()
  }, [clearHideTimer, onPause])

  const onScreenTap = useCallback(() => {
    if (!isPlaying) return
    setControlsVisible(true)
    startHideTimer()
  }, [isPlaying, startHideTimer])

  useFocusEffect(
    useCallback(() => {
      const unlockedEpisodeId = consumeLastUnlockedEpisode()
      if (unlockedEpisodeId !== null) {
        onUnlockedEpisode?.(String(unlockedEpisodeId))
        onResume()
      }

      return () => {
        onPause()
        clearHideTimer()
      }
    }, [clearHideTimer, onPause, onResume, onUnlockedEpisode])
  )

  return {
    controlsVisible,
    play,
    pause,
    onScreenTap,
    pauseOnBlur: onPause,
  }
}
