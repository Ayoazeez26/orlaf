import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useGetSeries } from "../../../hooks/use-feed"
import { HOME_CATEGORY_TABS, type HomeCategoryTabId } from "../constants"
import { TrendingTabContent } from "./trending-tab-content"

type HomeTabContentProps = {
  tabId: HomeCategoryTabId
}

function DefaultHomeTabContent({ tabId }: HomeTabContentProps) {
  const tab = HOME_CATEGORY_TABS.find((item) => item.id === tabId)
  const { data: series, isLoading } = useGetSeries()

  if (!tab) return null

  // First series → hero featured
  const featured = series?.[0]
  // First 3 series → new releases
  const newReleases = series?.slice(0, 3) ?? []

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color="#7C3AED" />
      </View>
    )
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View className="h-140 overflow-hidden">
        {featured?.posterUrl ? (
          <Image
            source={{ uri: featured.posterUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={require("../../../../assets/images/palm-wine-movie.png")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        )}

        <Image
          source={require("../../../../assets/images/overlay-img/Gradient.png")}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: "100%",
          }}
          resizeMode="stretch"
        />

        <View className="absolute right-0 bottom-0 left-0 flex-row items-end justify-between p-5">
          <View className="mr-4 flex-1">
            <Text
              className="mb-1 font-bold text-2xl text-white leading-8"
              numberOfLines={2}
            >
              {featured?.title ?? tab.heroTitle}
            </Text>
            <Text className="mb-4 text-gray-300 text-xs" numberOfLines={1}>
              {featured
                ? `${featured.genres[0] ?? ""} · ${featured._count.episodes} episodes`
                : tab.heroSubtitle}
            </Text>
            <TouchableOpacity
              onPress={() =>
                featured
                  ? router.push(`/dashboard/movie/player/${featured.id}`)
                  : router.push("/dashboard/movie/player/1")
              }
              className="h-12 flex-row items-center gap-2 self-start rounded-xl bg-white px-10"
            >
              <Ionicons name="play" size={14} color="#000" />
              <Text className="font-semibold text-black text-sm">
                Watch Now
              </Text>
            </TouchableOpacity>
          </View>
          <View className="mb-2 flex-row gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                className={`h-2 rounded-full ${
                  i === 0 ? "w-6 bg-white" : "w-2 bg-white/30"
                }`}
              />
            ))}
          </View>
        </View>
      </View>

      {/* New Releases — max 3 series */}
      <Text className="mb-3 px-5 font-semibold text-lg text-white">
        {tab.sectionTitle}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
        className="mb-6"
      >
        {newReleases.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push(`/dashboard/movie/player/${item.id}`)}
          >
            <View className="h-34 w-32 overflow-hidden rounded-xl">
              {item.posterUrl ? (
                <Image
                  source={{ uri: item.posterUrl }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={require("../../../../assets/images/movie-1.png")}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              )}
              <View className="absolute inset-0 bg-black/20" />
            </View>
            <Text
              className="mt-1 w-32 font-medium text-white text-xs"
              numberOfLines={1}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  )
}

export function HomeTabContent({ tabId }: HomeTabContentProps) {
  if (
    tabId === "trending" ||
    tabId === "new" ||
    tabId === "popular" ||
    tabId === "old-nollywood" ||
    tabId === "ai-films" ||
    tabId === "sable-originals"
  ) {
    return <TrendingTabContent />
  }

  return <DefaultHomeTabContent tabId={tabId} />
}
