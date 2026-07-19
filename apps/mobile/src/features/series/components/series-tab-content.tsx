import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { CreatorLink } from "../../creator/components/creator-link"
import type {
  CastMember,
  CrewMember,
  SeriesDetail,
  SeriesEpisode,
  SimilarShow,
} from "../data"

function AboutRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between border-white/5 border-b py-4">
      <Text className="text-[#8C8E9C] text-sm">{label}</Text>
      <Text className="font-semibold text-sm text-white">{value}</Text>
    </View>
  )
}

export function EpisodesTabContent({ series }: { series: SeriesDetail }) {
  return (
    <View className="gap-3 px-5 pb-8">
      {series.episodeList.map((episode) => (
        <EpisodeRow key={episode.id} episode={episode} seriesId={series.id} />
      ))}
    </View>
  )
}

function EpisodeRow({
  episode,
  seriesId,
}: {
  episode: SeriesEpisode
  seriesId: string
}) {
  return (
    <TouchableOpacity
      onPress={() =>
        router.push(`/dashboard/movie/player/${seriesId}?episode=${episode.id}`)
      }
      className="flex-row items-center gap-3 rounded-3xl bg-[#10111A] p-3"
    >
      <View className="relative h-16 w-24 overflow-hidden rounded-xl">
        <Image
          source={episode.image}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        <View className="absolute inset-0 items-center justify-center bg-black/30">
          <Ionicons
            name={episode.locked ? "lock-closed" : "play"}
            size={18}
            color="#fff"
          />
        </View>
      </View>
      <View className="min-w-0 flex-1">
        <Text className="mb-0.5 font-semibold text-sm text-white">
          {episode.title}
        </Text>
        <Text className="text-[#8C8E9C] text-xs">{episode.subtitle}</Text>
      </View>
      <Text className="text-[#8C8E9C] text-xs">{episode.duration}</Text>
    </TouchableOpacity>
  )
}

export function AboutTabContent({ series }: { series: SeriesDetail }) {
  return (
    <View className="px-5 pb-8">
      <AboutRow label="Studio" value={series.studio} />
      <AboutRow label="Genre" value={series.genre} />
      <AboutRow label="Year" value={String(series.year)} />
      <AboutRow label="Rating" value={`${series.rating.toFixed(1)} / 5`} />
      <AboutRow label="Age" value={series.ageRating} />
      <AboutRow
        label="Type"
        value={`Series · ${series.seasons} Seasons · ${series.episodes} Episodes`}
      />
      <AboutRow label="Language" value={series.language} />
    </View>
  )
}

const CAST_AVATAR_SIZE = 80

function CastAvatar({ member }: { member: CastMember }) {
  return (
    <View className="mr-4 shrink-0 items-center">
      <View
        className="mb-2 overflow-hidden rounded-full"
        style={{ width: CAST_AVATAR_SIZE, height: CAST_AVATAR_SIZE }}
      >
        <LinearGradient
          colors={["#1F1C3D", "#191A24"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            width: CAST_AVATAR_SIZE,
            height: CAST_AVATAR_SIZE,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text className="font-bold text-sm text-white">
            {member.initials}
          </Text>
        </LinearGradient>
      </View>
      <Text className="mb-0.5 font-medium text-white text-xs" numberOfLines={1}>
        {member.name}
      </Text>
      <Text className="text-[#8C8E9C] text-[10px]" numberOfLines={1}>
        as {member.role}
      </Text>
    </View>
  )
}

function CrewRow({ member }: { member: CrewMember }) {
  const size = 40

  return (
    <View className="mb-3 flex-row items-center gap-3 rounded-3xl border border-white/10 bg-[#10111A] p-2.5">
      <View
        className="overflow-hidden rounded-full"
        style={{ width: size, height: size }}
      >
        <LinearGradient
          colors={["#1F1C3D", "#191A24"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            width: size,
            height: size,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text className="font-bold text-white text-xs">
            {member.initials}
          </Text>
        </LinearGradient>
      </View>
      <View>
        <Text className="font-semibold text-[13px] text-white">
          {member.name}
        </Text>
        <Text className="text-[#8C8E9C] text-[11px]">{member.role}</Text>
      </View>
    </View>
  )
}

export function CastTabContent({ series }: { series: SeriesDetail }) {
  return (
    <View className="pb-8">
      <View className="mb-3 flex-row items-center justify-between px-5">
        <Text className="font-bold text-[#F8F8F8] text-[13px] tracking-[0.65px]">
          CAST
        </Text>
        <Text className="text-[#8C8E9C] text-[11px]">
          {series.cast.length} members
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      >
        {series.cast.map((member) => (
          <CastAvatar key={member.id} member={member} />
        ))}
      </ScrollView>

      <View className="mb-3 px-5">
        <Text className="font-bold text-[13px] text-white tracking-[0.65px]">
          CREW
        </Text>
      </View>
      <View className="px-5">
        {series.crew.map((member) => (
          <CrewRow key={member.id} member={member} />
        ))}
      </View>
    </View>
  )
}

function SimilarShowItem({ show }: { show: SimilarShow }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/dashboard/series/${show.id}`)}
      className="mb-4"
      style={{ width: "31%" }}
    >
      <View className="mb-2 aspect-2/3 overflow-hidden rounded-xl">
        <Image
          source={show.image}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
      <Text
        className="mb-0.5 font-semibold text-[#F8F8F8] text-[13px]"
        numberOfLines={1}
      >
        {show.title}
      </Text>
      <Text className="text-[#8C8E9C] text-xs" numberOfLines={1}>
        {show.genre} · {show.seasons} Season{show.seasons === 1 ? "" : "s"}
      </Text>
    </TouchableOpacity>
  )
}

export function SimilarTabContent({ series }: { series: SeriesDetail }) {
  return (
    <View className="flex-row flex-wrap justify-between px-5 pb-8">
      {series.similar.map((show) => (
        <SimilarShowItem key={show.id} show={show} />
      ))}
    </View>
  )
}

export function SeriesMetaRow({ series }: { series: SeriesDetail }) {
  return (
    <View className="mt-2 flex-row flex-wrap items-center gap-2">
      <View className="rounded-full bg-primary/20 px-3 py-1">
        <Text className="font-medium text-primary text-xs">{series.genre}</Text>
      </View>
      <CreatorLink
        creatorId={series.creatorId}
        name={series.creatorName}
        initials={series.creatorInitials}
        size="sm"
      />
    </View>
  )
}
