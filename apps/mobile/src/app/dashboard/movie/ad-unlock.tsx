import { router, useLocalSearchParams } from "expo-router"
import { AdUnlockOverlay } from "../../../features/episode-unlock/ad-unlock-overlay"
import { unlockEpisodeViaAd } from "../../../features/episode-unlock/session"

export default function AdUnlockScreen() {
  const { episode } = useLocalSearchParams<{ episode: string }>()
  const episodeNumber = Number(episode)

  const handleComplete = () => {
    if (!Number.isNaN(episodeNumber)) {
      unlockEpisodeViaAd(episodeNumber)
    }
    router.back()
  }

  return (
    <AdUnlockOverlay
      visible
      episodeNumber={Number.isNaN(episodeNumber) ? 1 : episodeNumber}
      onComplete={handleComplete}
    />
  )
}
