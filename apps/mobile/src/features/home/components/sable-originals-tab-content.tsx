import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import {
  Image,
  type ImageSourcePropType,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

type SableOriginalItem = {
  id: string
  title: string
  description?: string
  image: ImageSourcePropType
}

const FEATURED_ORIGINAL: SableOriginalItem = {
  id: "the-returnees",
  title: "The Returnees",
  description:
    "A young woman returns home after a decade abroad and unravels the secrets her family kept while she was gone.",
  image: require("../../../../assets/images/movie-3.png"),
}

const MORE_ORIGINALS: SableOriginalItem[] = [
  {
    id: "palm-wine-diaries",
    title: "Palm Wine Diaries",
    image: require("../../../../assets/images/palm-wine-movie.png"),
  },
  {
    id: "blood-and-soil",
    title: "Blood & Soil",
    image: require("../../../../assets/images/movie-2.png"),
  },
  {
    id: "dakar-sunsets",
    title: "Dakar Sunsets",
    image: require("../../../../assets/images/movie-1.png"),
  },
]

const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
})

function SableOriginalHeroCard({ item }: { item: SableOriginalItem }) {
  return (
    <View className="mb-8 overflow-hidden rounded-2xl">
      <View className="h-[480px]">
        <Image
          source={item.image}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />

        <View className="absolute top-3 left-3 rounded-full bg-black/50 px-3 py-1.5">
          <Text className="font-bold text-[10px] text-white tracking-wide">
            SABLE ORIGINAL
          </Text>
        </View>

        <View className="absolute inset-x-0 top-14 items-center px-6">
          <Text
            className="text-center text-3xl tracking-[2px]"
            style={{
              fontFamily: SERIF_FONT,
              color: "#1A1A1A",
            }}
          >
            {item.title.toUpperCase()}
          </Text>
        </View>

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

        <View className="absolute right-0 bottom-0 left-0 p-4">
          <Text className="mb-2 font-bold text-2xl text-white">
            {item.title}
          </Text>
          {item.description ? (
            <Text className="mb-4 text-sm text-white/90 leading-5">
              {item.description}
            </Text>
          ) : null}

          <TouchableOpacity
            onPress={() => router.push(`/dashboard/movie/player/${item.id}`)}
            className="h-10 flex-row items-center justify-center gap-2 rounded-full bg-white"
          >
            <Ionicons name="play" size={16} color="#000" />
            <Text className="font-semibold text-black text-sm">Watch Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

function MoreOriginalCard({ item }: { item: SableOriginalItem }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/dashboard/movie/player/${item.id}`)}
      className="mb-6 overflow-hidden rounded-2xl"
    >
      <View className="h-[360px]">
        <Image
          source={item.image}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />

        <View className="absolute top-3 left-3 rounded-full bg-black/50 px-3 py-1.5">
          <Text className="font-bold text-[10px] text-white tracking-wide">
            SABLE ORIGINAL
          </Text>
        </View>

        <View className="absolute inset-x-0 top-12 items-center px-6">
          <Text
            className="text-center text-white text-xl tracking-[2px]"
            style={{ fontFamily: SERIF_FONT }}
          >
            {item.title.toUpperCase()}
          </Text>
        </View>

        <Image
          source={require("../../../../assets/images/overlay-img/Gradient.png")}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: "35%",
          }}
          resizeMode="stretch"
        />

        <View className="absolute right-0 bottom-0 left-0 p-4">
          <Text className="font-bold text-lg text-white">{item.title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export function SableOriginalsTabContent() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
    >
      <View className="pt-4">
        <SableOriginalHeroCard item={FEATURED_ORIGINAL} />

        <Text className="mb-4 font-bold text-sm text-white tracking-[-0.35px]">
          More Originals
        </Text>

        {MORE_ORIGINALS.map((item) => (
          <MoreOriginalCard key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  )
}
