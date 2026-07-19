import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { router } from "expo-router"
import {
  Image,
  type ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

type PopularRankedItem = {
  id: string
  rank: number
  title: string
  views: string
  image: ImageSourcePropType
}

type RegionalItem = {
  id: string
  title: string
  genre: string
  views: string
  image: ImageSourcePropType
}

const POPULAR_HERO = {
  id: "mamas-kitchen",
  title: "Mama's Kitchen",
  description: "Three generations, one kitchen, and a never-ending supply",
  views: "24.1M",
  image: require("../../../../assets/images/movie-2.png"),
}

const POPULAR_RANKED: PopularRankedItem[] = [
  {
    id: "lagos-after-dark",
    rank: 2,
    title: "Lagos After Dark",
    views: "19.6M",
    image: require("../../../../assets/images/movie-3.png"),
  },
  {
    id: "the-kingdom-falls",
    rank: 3,
    title: "The Kingdom Falls",
    views: "17.2M",
    image: require("../../../../assets/images/palm-wine-movie.png"),
  },
]

const REGIONAL_ITEMS: RegionalItem[] = [
  {
    id: "palm-wine-days",
    title: "Palm Wine Days",
    genre: "Drama",
    views: "4.8M",
    image: require("../../../../assets/images/palm-wine-movie.png"),
  },
  {
    id: "city-lights",
    title: "City Lights",
    genre: "Romance",
    views: "3.9M",
    image: require("../../../../assets/images/movie-1.png"),
  },
  {
    id: "the-last-dance",
    title: "The Last Dance",
    genre: "Documentary",
    views: "3.2M",
    image: require("../../../../assets/images/movie-4.png"),
  },
  {
    id: "oceans-secret",
    title: "Ocean's Secret",
    genre: "Mystery",
    views: "2.7M",
    image: require("../../../../assets/images/onboarding.png"),
  },
]

function PopularHeroCard() {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/dashboard/movie/player/${POPULAR_HERO.id}`)}
      className="mb-4 overflow-hidden rounded-2xl"
    >
      <View className="h-[254px]">
        <Image
          source={POPULAR_HERO.image}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        <Image
          source={require("../../../../assets/images/overlay-img/Gradient.png")}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: "70%",
          }}
          resizeMode="stretch"
        />

        <View className="absolute top-3 left-3 flex-row items-center gap-1.5 rounded-full bg-[#F5C518] px-2.5 py-1.5">
          <Ionicons name="trophy" size={12} color="#000" />
          <Text className="font-bold text-[10px] text-black tracking-wide">
            MOST WATCHED
          </Text>
        </View>

        <View className="absolute top-3 right-3 overflow-hidden rounded-full">
          <BlurView intensity={8} tint="dark" style={StyleSheet.absoluteFill} />
          <View className="px-3 py-1.5">
            <Text className="font-medium text-[10px] text-white">
              {POPULAR_HERO.views} views
            </Text>
          </View>
        </View>

        <View className="absolute right-0 bottom-0 left-0 p-4">
          <Text className="mb-1 font-bold text-white text-xl">
            {POPULAR_HERO.title}
          </Text>
          <Text className="text-white text-xs">{POPULAR_HERO.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function PopularRankedCard({ item }: { item: PopularRankedItem }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/dashboard/movie/player/${item.id}`)}
      className="flex-1 overflow-hidden rounded-2xl"
    >
      <View className="h-52">
        <Image
          source={item.image}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        <Image
          source={require("../../../../assets/images/overlay-img/Gradient.png")}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: "55%",
          }}
          resizeMode="stretch"
        />

        <View className="absolute top-2.5 left-2.5 h-7 w-7 items-center justify-center rounded-full bg-black/70">
          <Text className="font-bold text-white text-xs">#{item.rank}</Text>
        </View>

        <View className="absolute right-0 bottom-0 left-0 p-3">
          <Text
            className="mb-1 font-semibold text-sm text-white"
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <View className="flex-row items-center gap-1">
            <Ionicons name="eye-outline" size={12} color="#fff" />
            <Text className="text-[11px] text-white/90">{item.views}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function RegionalListItem({ item }: { item: RegionalItem }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/dashboard/movie/player/${item.id}`)}
      className="flex-row items-center gap-3 py-3"
    >
      <View className="h-14 w-24 overflow-hidden rounded-lg">
        <Image
          source={item.image}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>

      <View className="min-w-0 flex-1">
        <Text
          className="mb-1 font-semibold text-base text-white"
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-[#8A8A8A] text-xs">{item.genre}</Text>
          <Text className="text-[#8A8A8A] text-xs">·</Text>
          <View className="flex-row items-center gap-1">
            <Ionicons name="eye-outline" size={11} color="#8A8A8A" />
            <Text className="text-[#8A8A8A] text-xs">{item.views}</Text>
          </View>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={16} color="#555" />
    </TouchableOpacity>
  )
}

export function PopularTabContent() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
    >
      <View className="pt-4">
        <PopularHeroCard />

        <View className="mb-6 flex-row gap-3">
          {POPULAR_RANKED.map((item) => (
            <PopularRankedCard key={item.id} item={item} />
          ))}
        </View>

        <Text className="mb-2 font-bold text-lg text-white">
          Top in your region
        </Text>

        <View>
          {REGIONAL_ITEMS.map((item, index) => (
            <View
              key={item.id}
              className={
                index < REGIONAL_ITEMS.length - 1
                  ? "border-white/5 border-b"
                  : ""
              }
            >
              <RegionalListItem item={item} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}
