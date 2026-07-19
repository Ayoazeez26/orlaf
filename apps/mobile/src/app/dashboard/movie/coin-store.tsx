import { router, useLocalSearchParams } from "expo-router"
import { Dimensions, Pressable, View } from "react-native"
import { CoinStoreContent } from "../../../features/episode-unlock/coin-store-content"
import { unlockEpisodeViaCoins } from "../../../features/episode-unlock/session"

const SHEET_MAX_HEIGHT = Dimensions.get("window").height * 0.75

export default function CoinStoreScreen() {
  const { episode } = useLocalSearchParams<{ episode: string }>()
  const episodeNumber = Number(episode)

  const handlePurchase = () => {
    if (!Number.isNaN(episodeNumber)) {
      unlockEpisodeViaCoins(episodeNumber)
    }
    router.back()
  }

  return (
    <View className="flex-1 justify-end">
      <Pressable
        className="absolute inset-0 bg-black/60"
        onPress={() => router.back()}
        accessibilityLabel="Close coin store"
      />

      <View
        className="overflow-hidden rounded-t-3xl bg-[#080811]"
        style={{ maxHeight: SHEET_MAX_HEIGHT }}
      >
        <View className="items-center pt-3 pb-1">
          <View className="h-1 w-10 rounded-full bg-white/20" />
        </View>

        <CoinStoreContent
          onClose={() => router.back()}
          onPurchase={handlePurchase}
        />
      </View>
    </View>
  )
}
