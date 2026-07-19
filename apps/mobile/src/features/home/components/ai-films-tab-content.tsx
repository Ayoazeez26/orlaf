import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
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

type AiFilmItem = {
  id: string
  title: string
  genre: string
  image: ImageSourcePropType
}

const AI_FILMS: AiFilmItem[] = [
  {
    id: "savanna-rising",
    title: "Savanna Rising",
    genre: "Sci-Fi",
    image: require("../../../../assets/images/movie-3.png"),
  },
  {
    id: "neon-dreams",
    title: "Neon Dreams",
    genre: "AI Short · 18m",
    image: require("../../../../assets/images/movie-4.png"),
  },
  {
    id: "digital-lagos",
    title: "Digital Lagos",
    genre: "Fantasy",
    image: require("../../../../assets/images/movie-1.png"),
  },
]

function GenerativeCinemaCard() {
  return (
    <View
      className="mb-8 overflow-hidden rounded-2xl"
      style={{ borderWidth: 1, borderColor: COLORS.primaryBorder }}
    >
      <LinearGradient
        colors={[
          "rgba(127, 103, 255, 0.2)",
          "rgba(127, 103, 255, 0.05)",
          "rgba(127, 103, 255, 0)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ padding: 16 }}
      >
        <View className="flex-row items-start gap-1.5">
          <Ionicons name="sparkles" size={14} color={COLORS.primary} />
          <Text
            className="mb-2 font-bold text-[10px] tracking-[1.5px]"
            style={{ color: COLORS.primary }}
          >
            GENERATIVE CINEMA
          </Text>
        </View>
        <Text className="mb-2 font-bold text-lg text-white leading-[22.5px]">
          Stories crafted with AI
        </Text>
        <Text className="text-[#8C8E9C] text-xs leading-4">
          Imagined by African filmmakers. Rendered frame by frame.
        </Text>
      </LinearGradient>
    </View>
  )
}

function AiFilmCard({ item }: { item: AiFilmItem }) {
  const _displayTitle = item.title.toUpperCase()

  return (
    <TouchableOpacity
      onPress={() => router.push(`/dashboard/movie/player/${item.id}`)}
      className="mb-6 overflow-hidden rounded-2xl"
    >
      <View className="h-[480px]">
        <Image
          source={item.image}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />

        <View className="absolute top-3 left-3 flex-row items-center gap-1 rounded-full bg-black/40 px-2.5 py-1.5">
          <Ionicons name="sparkles" size={11} color={COLORS.primary} />
          <Text className="font-bold text-[10px] text-primary tracking-wide">
            AI
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
            height: "45%",
          }}
          resizeMode="stretch"
        />

        <View className="absolute right-0 bottom-0 left-0 p-4">
          <Text className="mb-1 font-bold text-lg text-white">
            {item.title}
          </Text>
          <Text className="text-[#8C8E9C] text-sm">{item.genre}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export function AiFilmsTabContent() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
    >
      <View className="pt-4">
        <GenerativeCinemaCard />

        {AI_FILMS.map((item) => (
          <AiFilmCard key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  )
}
