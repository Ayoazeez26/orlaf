import type BottomSheet from "@expo/ui/community/bottom-sheet"
import { router } from "expo-router"
import { useCallback, useRef, useState } from "react"
import {
  isEpisodeUnlockedInSession,
} from "../../episode-unlock/session"
import type { SeriesPlayerEpisode } from "./use-series-player-data"

export type EpisodeSheetView = "episodes" | "premium"

type UseEpisodePickerOptions = {
  episodes: SeriesPlayerEpisode[]
  selectedEpisodeId: string | null
  onSelectEpisode: (episodeId: string) => void
  onPausePlayback: () => void
  onPlaybackEndedAtGate?: () => void
}

export function useEpisodePicker({
  episodes,
  selectedEpisodeId,
  onSelectEpisode,
  onPausePlayback,
  onPlaybackEndedAtGate,
}: UseEpisodePickerOptions) {
  const sheetRef = useRef<BottomSheet>(null)
  const [sheetView, setSheetView] = useState<EpisodeSheetView>("episodes")
  const [premiumEpisodeId, setPremiumEpisodeId] = useState<string | null>(null)

  const isEpisodeUnlocked = useCallback(
    (episode: SeriesPlayerEpisode) =>
      episode.accessType === "free" || isEpisodeUnlockedInSession(episode.id),
    []
  )

  const openEpisodes = useCallback(() => {
    setSheetView("episodes")
    setPremiumEpisodeId(null)
    sheetRef.current?.snapToIndex(0)
  }, [])

  const closeSheet = useCallback(() => {
    setSheetView("episodes")
    setPremiumEpisodeId(null)
  }, [])

  const handleEpisodePress = useCallback(
    (episode: SeriesPlayerEpisode) => {
      if (isEpisodeUnlocked(episode)) {
        onSelectEpisode(episode.id)
        sheetRef.current?.close()
        return
      }

      setPremiumEpisodeId(episode.id)
      setSheetView("premium")
    },
    [isEpisodeUnlocked, onSelectEpisode]
  )

  const premiumEpisode =
    episodes.find((episode) => episode.id === premiumEpisodeId) ?? null

  const navigateToUnlock = useCallback(
    (pathname: "/dashboard/movie/ad-unlock" | "/dashboard/movie/coin-store") => {
      if (!premiumEpisodeId) return
      onPausePlayback()
      sheetRef.current?.close()
      router.push({
        pathname,
        params: { episode: premiumEpisodeId },
      })
    },
    [onPausePlayback, premiumEpisodeId]
  )

  const showPremiumForEpisode = useCallback(
    (episode: SeriesPlayerEpisode, fromPlaybackEnd = false) => {
      onPausePlayback()
      if (fromPlaybackEnd) {
        onPlaybackEndedAtGate?.()
      }
      setPremiumEpisodeId(episode.id)
      setSheetView("premium")
      sheetRef.current?.snapToIndex(0)
    },
    [onPausePlayback, onPlaybackEndedAtGate]
  )

  const advanceFromEpisode = useCallback(
    (currentEpisodeId: string | null) => {
      if (episodes.length === 0) return

      const currentIndex = currentEpisodeId
        ? episodes.findIndex((episode) => episode.id === currentEpisodeId)
        : -1

      const nextEpisode = episodes[currentIndex + 1]
      if (!nextEpisode) {
        onPausePlayback()
        onPlaybackEndedAtGate?.()
        return
      }

      if (isEpisodeUnlocked(nextEpisode)) {
        onSelectEpisode(nextEpisode.id)
        return
      }

      showPremiumForEpisode(nextEpisode, true)
    },
    [
      episodes,
      isEpisodeUnlocked,
      onPausePlayback,
      onPlaybackEndedAtGate,
      onSelectEpisode,
      showPremiumForEpisode,
    ]
  )

  return {
    sheetRef,
    sheetView,
    setSheetView,
    premiumEpisode,
    premiumEpisodeNumber: premiumEpisode
      ? episodes.findIndex((episode) => episode.id === premiumEpisode.id) + 1
      : null,
    selectedEpisodeId,
    isEpisodeUnlocked,
    openEpisodes,
    closeSheet,
    handleEpisodePress,
    watchAd: () => navigateToUnlock("/dashboard/movie/ad-unlock"),
    buyCoins: () => navigateToUnlock("/dashboard/movie/coin-store"),
    advanceFromEpisode,
    showPremiumForEpisode,
  }
}
