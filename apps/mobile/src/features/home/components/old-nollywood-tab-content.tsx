import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import {
  type ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { COLORS } from "../../../constants/theme"
import { MoviePoster } from "./movie-poster"

type ClassicItem = {
  id: string
  title: string
  year: number
  description: string
  image: ImageSourcePropType
}

const CLASSIC_ITEMS: ClassicItem[] = [
  {
    id: "mamas-kitchen",
    title: "Mama's Kitchen",
    year: 1995,
    description:
      "Three generations, one kitchen, and a never-ending supply of jollof, gossip and grace.",
    image: require("../../../../assets/images/movie-2.png"),
  },
  {
    id: "palm-wine-days",
    title: "Palm Wine Days",
    year: 1997,
    description:
      "A love story set against the golden coastlines of West Africa, where two souls reconnect over palm wine and old memories.",
    image: require("../../../../assets/images/palm-wine-movie.png"),
  },
  {
    id: "the-returnees",
    title: "The Returnees",
    year: 1999,
    description:
      "A young woman returns home after a decade abroad and unravels the secrets buried in her family's past.",
    image: require("../../../../assets/images/movie-3.png"),
  },
]

function VintageVaultCard() {
  return (
    <View
      className="mb-8 overflow-hidden rounded-2xl"
      style={{ borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.1)" }}
    >
      <LinearGradient
        colors={[
          "rgba(254, 154, 0, 0.1)",
          "rgba(255, 105, 0, 0.05)",
          "rgba(255, 105, 0, 0)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ padding: 16 }}
      >
        <Text
          className="mb-2 font-bold text-[10px] tracking-[1.5px]"
          style={{ color: "#FE9A00" }}
        >
          VINTAGE VAULT
        </Text>
        <Text className="mb-2 font-bold text-lg text-white leading-[22.5px]">
          Classics that built Nollywood
        </Text>
        <Text className="text-[#8C8E9C] text-xs leading-4">
          Restored prints. Original soundtracks. Timeless drama.
        </Text>
      </LinearGradient>
    </View>
  )
}

function ClassicListItem({
  item,
  imageOnLeft,
}: {
  item: ClassicItem
  imageOnLeft: boolean
}) {
  const poster = (
    <MoviePoster
      source={item.image}
      className="h-44 w-32 shrink-0"
      borderRadius={18}
    />
  )

  const details = (
    <View className="min-w-0 flex-1 justify-center">
      <Text
        className="mb-1.5 font-bold text-[10px] tracking-[0.5px]"
        style={{ color: COLORS.primary }}
      >
        CLASSIC · {item.year}
      </Text>
      <Text className="mb-2 font-bold text-base text-white">{item.title}</Text>
      <Text className="text-[#8C8E9C] text-xs leading-4" numberOfLines={4}>
        {item.description}
      </Text>
    </View>
  )

  return (
    <TouchableOpacity
      onPress={() => router.push(`/dashboard/movie/player/${item.id}`)}
      className="mb-8 flex-row items-center gap-4"
      style={imageOnLeft ? undefined : { flexDirection: "row-reverse" }}
    >
      {poster}
      {details}
    </TouchableOpacity>
  )
}

export function OldNollywoodTabContent() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
    >
      <View className="pt-4">
        <VintageVaultCard />

        {CLASSIC_ITEMS.map((item, index) => (
          <ClassicListItem
            key={item.id}
            item={item}
            imageOnLeft={index % 2 === 0}
          />
        ))}
      </View>
    </ScrollView>
  )
}
