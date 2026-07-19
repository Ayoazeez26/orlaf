import { Ionicons } from "@expo/vector-icons"
import { Image, Text, TouchableOpacity, View } from "react-native"
import type { PublicSeries } from "../../../services/catalog-api"
import { CreatorLink } from "../../creator/components/creator-link"
import { GRADIENT_OVERLAY } from "../constants"
import type { SeriesPlayerEpisode } from "../hooks/use-series-player-data"
import { getCreatorDisplay } from "../utils/creator-display"
import { PlayerProgressBar } from "./player-progress-bar"

type PlayerInfoBarProps = {
  series: PublicSeries
  selectedEpisode: SeriesPlayerEpisode | null
  selectedEpisodeIndex: number | null
  episodeCount: number
  currentTime: number
  duration: number
  onOpenEpisodes: () => void
  onSeek: (timeSeconds: number) => void
  onScrubStart?: () => void
  onScrubEnd?: () => void
}

export function PlayerInfoBar({
  series,
  selectedEpisode,
  selectedEpisodeIndex,
  episodeCount,
  currentTime,
  duration,
  onOpenEpisodes,
  onSeek,
  onScrubStart,
  onScrubEnd,
}: PlayerInfoBarProps) {
  const creator = getCreatorDisplay(series)

  return (
    <View className="absolute right-0 bottom-0 left-0" style={{ zIndex: 10 }}>
      <Image
        source={GRADIENT_OVERLAY}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: 300,
        }}
        resizeMode="stretch"
      />
      <View className="px-5 pt-5 pb-10">
        <Text className="mb-2 font-bold text-lg text-white">
          {selectedEpisode?.title ?? series.title}
        </Text>

        <View className="mb-2 flex-row flex-wrap items-center gap-2">
          {creator.name ? (
            <CreatorLink
              creatorId={creator.creatorId}
              name={creator.name}
              initials={creator.initials}
            />
          ) : null}
          {series.genres.map((genre) => (
            <View key={genre} className="rounded-full bg-white/10 px-3 py-1">
              <Text className="font-medium text-sm text-white/70">{genre}</Text>
            </View>
          ))}
        </View>

        <Text className="text-[17px] text-white/60" numberOfLines={2}>
          {selectedEpisode?.synopsis ?? series.synopsis}
        </Text>

        <PlayerProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={onSeek}
          onScrubStart={onScrubStart}
          onScrubEnd={onScrubEnd}
        />

        <TouchableOpacity
          onPress={onOpenEpisodes}
          className="flex-row items-center justify-between rounded-xl bg-[#1A1A1A] p-3.5"
        >
          <View className="flex-row items-center gap-2">
            <View className="items-center justify-center rounded-lg bg-white/10 p-2">
              <Ionicons name="play" size={20} color="white" />
            </View>
            {selectedEpisodeIndex ? (
              <>
                <Text className="font-semibold text-lg text-white">
                  EP.{selectedEpisodeIndex}
                </Text>
                <Text className="text-lg text-white/50">
                  / EP.{episodeCount}
                </Text>
              </>
            ) : (
              <Text className="font-semibold text-lg text-white">
                Trailer · {episodeCount} Episodes
              </Text>
            )}
          </View>
          <Ionicons name="chevron-up" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  )
}
