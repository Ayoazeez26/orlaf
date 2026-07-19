// import { Ionicons } from "@expo/vector-icons"
// import { router } from "expo-router"
// import {
//   Image,
//   type ImageSourcePropType,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native"
// import { COLORS } from "../../../constants/theme"
// import { useGetSeries } from "../../../hooks/use-feed"

// type TrendDirection = "up" | "down"

// type TrendingChartItem = {
//   id: string
//   rank: number
//   title: string
//   genre: string
//   episodes: number
//   views: string
//   image: ImageSourcePropType
//   trend?: {
//     direction: TrendDirection
//     delta: number
//   }
// }

// const TRENDING_CHARTS: TrendingChartItem[] = [
//   {
//     id: "1",
//     rank: 1,
//     title: "The Kingdom Falls",
//     genre: "Epic",
//     episodes: 8,
//     views: "12.4M",
//     image: require("../../../../assets/images/palm-wine-movie.png"),
//   },
//   {
//     id: "2",
//     rank: 2,
//     title: "Blood & Soil",
//     genre: "Thriller",
//     episodes: 6,
//     views: "9.8M",
//     image: require("../../../../assets/images/movie-1.png"),
//     trend: { direction: "up", delta: 2 },
//   },
//   {
//     id: "3",
//     rank: 3,
//     title: "Lagos After Dark",
//     genre: "Drama",
//     episodes: 12,
//     views: "8.1M",
//     image: require("../../../../assets/images/movie-2.png"),
//     trend: { direction: "down", delta: 1 },
//   },
//   {
//     id: "4",
//     rank: 4,
//     title: "The Returnees",
//     genre: "Mystery",
//     episodes: 5,
//     views: "7.5M",
//     image: require("../../../../assets/images/movie-3.png"),
//     trend: { direction: "up", delta: 1 },
//   },
//   {
//     id: "5",
//     rank: 5,
//     title: "Dakar Sunsets",
//     genre: "Romance",
//     episodes: 10,
//     views: "6.9M",
//     image: require("../../../../assets/images/movie-4.png"),
//     trend: { direction: "down", delta: 2 },
//   },
//   {
//     id: "6",
//     rank: 6,
//     title: "Street Legends",
//     genre: "Action",
//     episodes: 7,
//     views: "6.2M",
//     image: require("../../../../assets/images/movie-1.png"),
//     trend: { direction: "up", delta: 3 },
//   },
//   {
//     id: "7",
//     rank: 7,
//     title: "Queen of Hearts",
//     genre: "Drama",
//     episodes: 9,
//     views: "5.8M",
//     image: require("../../../../assets/images/movie-2.png"),
//     trend: { direction: "down", delta: 1 },
//   },
//   {
//     id: "8",
//     rank: 8,
//     title: "Neon Dreams",
//     genre: "Sci-Fi",
//     episodes: 4,
//     views: "5.1M",
//     image: require("../../../../assets/images/movie-3.png"),
//     trend: { direction: "up", delta: 2 },
//   },
//   {
//     id: "9",
//     rank: 9,
//     title: "Midnight Lagos",
//     genre: "Crime",
//     episodes: 8,
//     views: "4.7M",
//     image: require("../../../../assets/images/movie-4.png"),
//     trend: { direction: "down", delta: 3 },
//   },
//   {
//     id: "10",
//     rank: 10,
//     title: "Palm Wine Diaries",
//     genre: "Comedy",
//     episodes: 6,
//     views: "4.2M",
//     image: require("../../../../assets/images/onboarding.png"),
//     trend: { direction: "up", delta: 1 },
//   },
// ]

// function TrendingFeaturedCard({ item }: { item: TrendingChartItem }) {
//   return (
//     <TouchableOpacity
//       onPress={() => router.push(`/dashboard/movie/player/${item.id}`)}
//       className="mb-6 overflow-hidden rounded-2xl"
//     >
//       <View className="h-52">
//         <Image
//           source={item.image}
//           style={{ width: "100%", height: "100%" }}
//           resizeMode="cover"
//         />
//         <View className="absolute inset-0 bg-black/20" />
//         <Image
//           source={require("../../../../assets/images/overlay-img/Gradient.png")}
//           style={{
//             position: "absolute",
//             bottom: 0,
//             left: 0,
//             right: 0,
//             width: "100%",
//             height: "70%",
//           }}
//           resizeMode="stretch"
//         />

//         <View className="absolute top-3 left-3 flex-row items-center gap-1.5 rounded-full bg-primary px-3 py-1.5">
//           <Ionicons name="flame" size={12} color="#fff" />
//           <Text className="font-bold text-[10px] text-white tracking-wide">
//             #1 THIS WEEK
//           </Text>
//         </View>

//         <View className="absolute right-0 bottom-0 left-0 p-4">
//           <Text className="mb-2 font-bold text-lg text-white">
//             {item.title}
//           </Text>
//           <View className="flex-row items-center gap-1.5">
//             <Ionicons name="eye-outline" size={14} color="#FFFFFF" />
//             <View className="flex-row items-center">
//               <Text className="text-white text-xs">{item.views} views</Text>
//               <Text className="mx-3 text-white text-xs">·</Text>
//               <Text className="text-white text-xs">{item.genre}</Text>
//               <Text className="mx-3 text-white text-xs">·</Text>
//               <Text className="text-white text-xs">{item.episodes} ep</Text>
//             </View>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   )
// }

// function TrendingListRow({ item }: { item: TrendingChartItem }) {
//   const trendColor = item.trend?.direction === "up" ? "#22C55E" : "#EF4444"
//   const trendIcon =
//     item.trend?.direction === "up" ? "trending-up" : "trending-down"

//   return (
//     <TouchableOpacity
//       onPress={() => router.push(`/dashboard/movie/player/${item.id}`)}
//       className="flex-row items-center gap-3 border-white/5 border-b py-4"
//     >
//       <View className="w-9 items-center">
//         <Text className="font-bold text-2xl text-white">{item.rank}</Text>
//         {item.trend ? (
//           <View className="mt-0.5 flex-row items-center gap-0.5">
//             <Ionicons name={trendIcon} size={12} color={trendColor} />
//             <Text
//               className="font-semibold text-[10px]"
//               style={{ color: trendColor }}
//             >
//               {item.trend.delta}
//             </Text>
//           </View>
//         ) : null}
//       </View>

//       <View className="h-24 w-16 overflow-hidden rounded-lg">
//         <Image
//           source={item.image}
//           style={{ width: "100%", height: "100%" }}
//           resizeMode="cover"
//         />
//       </View>

//       <View className="min-w-0 flex-1">
//         <Text
//           className="mb-1 font-bold text-[#F8F8F8] text-sm"
//           numberOfLines={1}
//         >
//           {item.title}
//         </Text>
//         <Text className="mb-1.5 text-[#8C8E9C] text-xs">
//           {item.genre} · {item.episodes} ep
//         </Text>
//         <View className="flex-row items-center gap-1">
//           <Ionicons name="eye-outline" size={12} color="#8C8E9C" />
//           <Text className="text-[#8C8E9C] text-xs">{item.views}</Text>
//         </View>
//       </View>

//       <View className="h-9 w-9 items-center justify-center">
//         <Ionicons name="play" size={18} color="#fff" />
//       </View>
//     </TouchableOpacity>
//   )
// }

// export function TrendingTabContent() {
//   const [featured, ...listItems] = TRENDING_CHARTS

//   const data = useGetSeries()

//   return (
//     <ScrollView
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
//     >
//       <View className="mb-5 flex-row items-end justify-between pt-4">
//         <View>
//           <Text
//             className="mb-1 font-bold text-[11px] tracking-[1.5px]"
//             style={{ color: COLORS.primary }}
//           >
//             SABLE CHARTS
//           </Text>
//           <Text className="font-bold text-2xl text-white">
//             Top 10 This Week
//           </Text>
//         </View>
//         <Text className="pb-0.5 text-[#8A8A8A] text-xs">Updated 2h ago</Text>
//       </View>

//       <TrendingFeaturedCard item={featured} />

//       <View>
//         {listItems.map((item) => (
//           <TrendingListRow key={item.id} item={item} />
//         ))}
//       </View>
//     </ScrollView>
//   )
// }

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
import { COLORS } from "../../../constants/theme"
import { useGetSeries } from "../../../hooks/use-feed"
import type { PublicSeries } from "../../../services/catalog-api"

// ---------------------------------------------------------------------------
// Featured card (first series)
// ---------------------------------------------------------------------------

function TrendingFeaturedCard({
  item,
  rank,
}: {
  item: PublicSeries
  rank: number
}) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/dashboard/movie/player/${item.id}`)}
      className="mb-6 overflow-hidden rounded-2xl"
    >
      <View className="h-52">
        {item.posterUrl ? (
          <Image
            source={{ uri: item.posterUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full bg-muted" />
        )}

        <View className="absolute inset-0 bg-black/20" />
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

        <View className="absolute top-3 left-3 flex-row items-center gap-1.5 rounded-full bg-primary px-3 py-1.5">
          <Ionicons name="flame" size={12} color="#fff" />
          <Text className="font-bold text-[10px] text-white tracking-wide">
            #{rank} THIS WEEK
          </Text>
        </View>

        <View className="absolute right-0 bottom-0 left-0 p-4">
          <Text className="mb-2 font-bold text-lg text-white">
            {item.title}
          </Text>
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="eye-outline" size={14} color="#FFFFFF" />
            <View className="flex-row items-center">
              <Text className="text-white text-xs">
                {item.genres[0] ?? "Drama"}
              </Text>
              <Text className="mx-3 text-white text-xs">·</Text>
              <Text className="text-white text-xs">
                {item._count.episodes} ep
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

// ---------------------------------------------------------------------------
// List row
// ---------------------------------------------------------------------------

function TrendingListRow({ item, rank }: { item: PublicSeries; rank: number }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/dashboard/movie/player/${item.id}`)}
      className="flex-row items-center gap-3 border-white/5 border-b py-4"
    >
      <View className="w-9 items-center">
        <Text className="font-bold text-2xl text-white">{rank}</Text>
      </View>

      <View className="h-24 w-16 overflow-hidden rounded-lg bg-muted">
        {item.posterUrl ? (
          <Image
            source={{ uri: item.posterUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : null}
      </View>

      <View className="min-w-0 flex-1">
        <Text
          className="mb-1 font-bold text-[#F8F8F8] text-sm"
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text className="mb-1.5 text-[#8C8E9C] text-xs">
          {item.genres[0] ?? "Drama"} · {item._count.episodes} ep
        </Text>
        <View className="flex-row items-center gap-1">
          <Text className="text-[#8C8E9C] text-xs">
            {item.creator.creatorProfile?.studioName ??
              item.creator.displayName}
          </Text>
        </View>
      </View>

      <View className="h-9 w-9 items-center justify-center">
        <Ionicons name="play" size={18} color="#fff" />
      </View>
    </TouchableOpacity>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function TrendingTabContent() {
  const { data: series, isLoading, isError } = useGetSeries()

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={COLORS.primary} />
      </View>
    )
  }

  if (isError || !series || series.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-center text-foreground text-sm">
          No series available right now.
        </Text>
      </View>
    )
  }

  const featured = series[0]

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
    >
      <View className="mb-5 flex-row items-end justify-between pt-4">
        <View>
          <Text
            className="mb-1 font-bold text-[11px] tracking-[1.5px]"
            style={{ color: COLORS.primary }}
          >
            SABLE CHARTS
          </Text>
          <Text className="font-bold text-2xl text-white">
            Top {series.length} This Week
          </Text>
        </View>
        <Text className="pb-0.5 text-[#8A8A8A] text-xs">Live</Text>
      </View>

      <TrendingFeaturedCard item={featured} rank={1} />
      <View>
        {series.map(
          (
            item,
            index // ← series not listItems
          ) => (
            <TrendingListRow key={item.id} item={item} rank={index + 1} />
          )
        )}
      </View>
    </ScrollView>
  )
}
