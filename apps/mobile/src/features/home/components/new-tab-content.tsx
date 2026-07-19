import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import {
  Image,
  type ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { COLORS } from "../../../constants/theme"

type ComingUpItem = {
  id: string
  title: string
  genre: string
  season: string
  dropLabel: string
  image: ImageSourcePropType
}

const COMING_UP_ITEMS: ComingUpItem[] = [
  {
    id: "accra-underground",
    title: "Accra Underground",
    genre: "Drama",
    season: "Season 2",
    dropLabel: "DROPS FRIDAY",
    image: require("../../../../assets/images/movie-3.png"),
  },
  {
    id: "lagos-after-dark",
    title: "Lagos After Dark",
    genre: "Thriller",
    season: "Season 1",
    dropLabel: "DROPS SUNDAY",
    image: require("../../../../assets/images/movie-4.png"),
  },
]

function NewHeroCard() {
  return (
    <View className="mb-8 overflow-hidden rounded-2xl">
      <View className="h-[462px]">
        <Image
          source={require("../../../../assets/images/palm-wine-movie.png")}
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
            height: "75%",
          }}
          resizeMode="stretch"
        />

        <View className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1.5">
          <Text className="font-bold text-[10px] text-white tracking-wide">
            PREMIERING TODAY
          </Text>
        </View>

        <View className="absolute right-0 bottom-0 left-0 p-4">
          <Text className="mb-1 font-bold text-[10px] text-white tracking-[2px]">
            SABLE ORIGINALS
          </Text>
          <Text className="mb-2 font-bold text-2xl text-white">
            Blood & Soil
          </Text>
          <Text className="mb-4 text-sm text-white/90 leading-4">
            When farmland turns to battleground, one boy's quiet courage becomes
            the spark a community needs.
          </Text>

          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => router.push("/dashboard/movie/player/1")}
              className="h-10 flex-1 flex-row items-center justify-center gap-2 rounded-full bg-white"
            >
              <Ionicons name="play" size={16} color="#000" />
              <Text className="font-semibold text-black text-sm">
                Watch Ep 1
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityLabel="Save Blood & Soil"
              className="h-10 w-10 items-center justify-center rounded-full border border-white/40"
            >
              <Ionicons name="bookmark-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

function ComingUpCard({ item }: { item: ComingUpItem }) {
  return (
    <View className="flex-row items-center gap-3 rounded-3xl border border-white/10 bg-[#10111A] p-3">
      <TouchableOpacity
        onPress={() => router.push(`/dashboard/movie/player/${item.id}`)}
        className="min-w-0 flex-1 flex-row items-center gap-3"
      >
        <View className="h-20 w-20 overflow-hidden rounded-xl">
          <Image
            source={item.image}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>

        <View className="min-w-0 flex-1">
          <View className="mb-1.5 flex-row items-center gap-1.5">
            <Ionicons
              name="calendar-outline"
              size={12}
              color={COLORS.primary}
            />
            <Text
              className="font-bold text-[10px] tracking-[0.5px]"
              style={{ color: COLORS.primary }}
            >
              {item.dropLabel}
            </Text>
          </View>
          <Text
            className="font-semibold text-[#F8F8F8] text-sm"
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text className="text-[#8C8E9C] text-xs">
            {item.genre} · {item.season}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityLabel={`Notify me about ${item.title}`}
        className="h-10 w-10 items-center justify-center rounded-full bg-[#191A24]"
      >
        <Ionicons name="notifications-outline" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

export function NewTabContent() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
    >
      <View className="pt-4">
        <NewHeroCard />
      </View>

      <View className="mb-4 flex-row items-center justify-between">
        <Text className="font-bold text-sm text-white tracking-[-0.35px]">
          Coming Up
        </Text>
        <Text className="text-[#8C8E9C] text-xs">This week</Text>
      </View>

      <View className="gap-3">
        {COMING_UP_ITEMS.map((item) => (
          <ComingUpCard key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  )
}
