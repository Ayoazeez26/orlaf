import { useEventListener } from "expo"
import type { VideoPlayer } from "expo-video"
import { useRef } from "react"

type UseEpisodeAutoplayOptions = {
  player: VideoPlayer
  selectedEpisodeId: string | null
  onEpisodeEnded: (currentEpisodeId: string | null) => void
  enabled?: boolean
}

export function useEpisodeAutoplay({
  player,
  selectedEpisodeId,
  onEpisodeEnded,
  enabled = true,
}: UseEpisodeAutoplayOptions) {
  const selectedEpisodeIdRef = useRef(selectedEpisodeId)
  selectedEpisodeIdRef.current = selectedEpisodeId

  const onEpisodeEndedRef = useRef(onEpisodeEnded)
  onEpisodeEndedRef.current = onEpisodeEnded

  useEventListener(player, "playToEnd", () => {
    if (!enabled) return
    onEpisodeEndedRef.current(selectedEpisodeIdRef.current)
  })
}
