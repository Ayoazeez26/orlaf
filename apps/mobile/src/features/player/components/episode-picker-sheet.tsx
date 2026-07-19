import type { RefObject } from "react"
import BottomSheet, {
  BottomSheetScrollView,
} from "@expo/ui/community/bottom-sheet"
import { Ionicons } from "@expo/vector-icons"
import {
  ActivityIndicator,
  Dimensions,
  Image,
  type ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { PremiumEpisodeSheetContent } from "../../../components/premium-episode-sheet-content"
import type { PublicSeries } from "../../../services/catalog-api"
import { CreatorLink } from "../../creator/components/creator-link"
import {
  DEFAULT_POSTER,
  EPISODE_GRID_COLUMNS,
  EPISODE_GRID_GAP,
} from "../constants"
import type { EpisodeSheetView } from "../hooks/use-episode-picker"
import type { SeriesPlayerEpisode } from "../hooks/use-series-player-data"
import { getCreatorDisplay } from "../utils/creator-display"

const ITEM_SIZE =
  (Dimensions.get("window").width -
    32 -
    EPISODE_GRID_GAP * (EPISODE_GRID_COLUMNS - 1)) /
  EPISODE_GRID_COLUMNS

type EpisodePickerSheetProps = {
  sheetRef: RefObject<BottomSheet | null>
  sheetView: EpisodeSheetView
  series: PublicSeries
  episodes: SeriesPlayerEpisode[]
  posterSource?: ImageSourcePropType
  freeEpisodeCount: number
  selectedEpisodeId: string | null
  episodeLoading: boolean
  premiumEpisodeNumber: number | null
  isEpisodeUnlocked: (episode: SeriesPlayerEpisode) => boolean
  onClose: () => void
  onShowEpisodes: () => void
  onEpisodePress: (episode: SeriesPlayerEpisode) => void
  onWatchAd: () => void
  onBuyCoins: () => void
}

export function EpisodePickerSheet({
  sheetRef,
  sheetView,
  series,
  episodes,
  posterSource = DEFAULT_POSTER,
  freeEpisodeCount,
  selectedEpisodeId,
  episodeLoading,
  premiumEpisodeNumber,
  isEpisodeUnlocked,
  onClose,
  onShowEpisodes,
  onEpisodePress,
  onWatchAd,
  onBuyCoins,
}: EpisodePickerSheetProps) {
  const creator = getCreatorDisplay(series)

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={["50%", "90%"]}
      enablePanDownToClose
      onClose={onClose}
    >
      {sheetView === "premium" && premiumEpisodeNumber !== null ? (
        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <PremiumEpisodeSheetContent
            episode={premiumEpisodeNumber}
            onClose={onShowEpisodes}
            onWatchAd={onWatchAd}
            onBuyCoins={onBuyCoins}
          />
        </BottomSheetScrollView>
      ) : (
        <BottomSheetScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-4 flex-row items-center gap-3">
            <Image
              source={posterSource}
              style={{ width: 62, height: 90, borderRadius: 4 }}
              resizeMode="cover"
            />
            <View className="min-w-0 flex-1">
              <Text className="mb-0.5 font-bold text-white">
                {series.title}
              </Text>
              <View className="mb-1 flex-row flex-wrap items-center gap-2">
                {creator.name ? (
                  <CreatorLink
                    creatorId={creator.creatorId}
                    name={creator.name}
                    initials={creator.initials}
                    size="sm"
                  />
                ) : null}
                {series.genres.slice(0, 1).map((genre) => (
                  <View
                    key={genre}
                    className="rounded-full bg-white/10 px-2 py-0.5"
                  >
                    <Text className="text-gray-300 text-xs">{genre}</Text>
                  </View>
                ))}
              </View>
              <Text className="text-gray-500 text-xs" numberOfLines={2}>
                {series.synopsis}
              </Text>
            </View>
          </View>

          <View className="mb-4 flex-row items-center gap-2">
            <Text className="font-bold text-base text-white">Episodes</Text>
            <View className="rounded-full bg-purple-600 px-2.5 py-0.5">
              <Text className="font-semibold text-white text-xs">
                {freeEpisodeCount} Free
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: EPISODE_GRID_GAP,
            }}
          >
            {episodes.map((episode, index) => {
              const unlocked = isEpisodeUnlocked(episode)
              const isSelected = episode.id === selectedEpisodeId
              const isLoadingSelected = isSelected && episodeLoading

              return (
                <TouchableOpacity
                  key={episode.id}
                  onPress={() => onEpisodePress(episode)}
                  style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
                >
                  <View
                    className={`flex-1 items-center justify-center rounded-xl ${
                      isSelected
                        ? "border-2 border-purple-500 bg-purple-600/30"
                        : unlocked
                          ? "border border-[#2E2E2E] bg-[#1e1e1e]"
                          : "border border-[#2E2E2E] bg-[#141414]"
                    }`}
                  >
                    {!unlocked && (
                      <Ionicons
                        name="lock-closed"
                        size={12}
                        color="#444"
                        style={{ position: "absolute", top: 6, right: 6 }}
                      />
                    )}
                    {isLoadingSelected ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text
                        className={`font-semibold text-sm ${
                          unlocked ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </BottomSheetScrollView>
      )}
    </BottomSheet>
  )
}
