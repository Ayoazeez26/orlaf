import { useCallback, useRef } from "react"

type UsePlaybackScrubbingOptions = {
  isPlaying: boolean
  onPause: () => void
  onPlay: () => void
}

export function usePlaybackScrubbing({
  isPlaying,
  onPause,
  onPlay,
}: UsePlaybackScrubbingOptions) {
  const wasPlayingRef = useRef(false)

  const onScrubStart = useCallback(() => {
    wasPlayingRef.current = isPlaying
    if (isPlaying) onPause()
  }, [isPlaying, onPause])

  const onScrubEnd = useCallback(() => {
    if (wasPlayingRef.current) onPlay()
  }, [onPlay])

  return { onScrubStart, onScrubEnd }
}
