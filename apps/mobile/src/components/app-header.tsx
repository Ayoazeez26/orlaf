import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
  BottomSheetView,
} from "@expo/ui/community/bottom-sheet"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useRef, useState } from "react"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"

const GENRES = ["Nollywood", "Action", "Animation", "Crime", "Bolly"]

const RESULTS = [
  {
    id: "1",
    title: "The Kingdom Falls",
    sub: "Series · Epic, Action",
    image: require("../../assets/images/movie-1.png"),
  },
  {
    id: "2",
    title: "Lagos After Dark",
    sub: "Series · Thriller, Crime",
    image: require("../../assets/images/movie-2.png"),
  },
  {
    id: "3",
    title: "Heartbeat of Accra",
    sub: "Movie · Romance, Nollywood",
    image: require("../../assets/images/movie-3.png"),
  },
  {
    id: "4",
    title: "Savanna Rising",
    sub: "Series · Sci-Fi, Fantasy",
    image: require("../../assets/images/movie-4.png"),
  },
  {
    id: "5",
    title: "Mama's Kitchen",
    sub: "Series · Comedy, Nollywood",
    image: require("../../assets/images/movie-1.png"),
  },
  {
    id: "6",
    title: "Shadow Market",
    sub: "Movie · Crime, Thriller",
    image: require("../../assets/images/movie-2.png"),
  },
  {
    id: "7",
    title: "Ancestral Echoes",
    sub: "Series · Fantasy, Epic",
    image: require("../../assets/images/movie-4.png"),
  },
]

type Props = {
  onProfilePress?: () => void
  onMenuPress?: () => void
  title?: string
}

export function AppHeader({
  onProfilePress,
  onMenuPress,
  title = "Sable TV",
}: Props) {
  const sheetRef = useRef<BottomSheet>(null)
  const [query, setQuery] = useState("")
  const [activeGenre, setActiveGenre] = useState("Nollywood")

  const filtered = RESULTS.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.sub.toLowerCase().includes(query.toLowerCase())
  )

  const handleClose = () => {
    sheetRef.current?.close()
    setQuery("")
  }

  const handleNavigate = (id: string) => {
    handleClose()
    setTimeout(() => {
      router.push(`/dashboard/movie/player/${id}`)
    }, 300)
  }

  return (
    <View>
      {/* Header bar */}
      <View className="flex-row items-center justify-between px-5 pt-14 pb-3">
        <Text className="font-black text-2xl text-white">{title}</Text>
        <View className="flex-row gap-5">
          <TouchableOpacity onPress={() => sheetRef.current?.snapToIndex(0)}>
            <Ionicons name="search-outline" size={22} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onProfilePress}>
            <Ionicons name="person-outline" size={22} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onMenuPress}>
            <Ionicons name="menu-outline" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet — no Host needed */}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={["90%"]}
        enablePanDownToClose
        onClose={() => setQuery("")}
      >
        <BottomSheetView style={{ flex: 1, paddingHorizontal: 16 }}>
          {/* Search bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#2E2E2E",
              paddingVertical: 12,
              marginBottom: 16,
            }}
          >
            <Ionicons name="search-outline" size={18} color="#555" />
            <BottomSheetTextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search titles, genres..."
              placeholderTextColor="#555"
              style={{
                flex: 1,
                fontSize: 14,
                color: "white",
                paddingHorizontal: 8,
              }}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={18} color="#555" />
              </TouchableOpacity>
            )}
          </View>

          {/* Genre chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0, marginBottom: 16 }}
            contentContainerStyle={{ gap: 8 }}
          >
            {GENRES.map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setActiveGenre(g)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: activeGenre === g ? "#9333ea" : "#2E2E2E",
                  backgroundColor:
                    activeGenre === g ? "#9333ea" : "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: activeGenre === g ? "white" : "#9ca3af",
                  }}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Results */}
          <BottomSheetFlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  backgroundColor: "#1a1a1a",
                  marginVertical: 8,
                }}
              />
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
            ListEmptyComponent={
              <View
                style={{ alignItems: "center", paddingVertical: 80, gap: 12 }}
              >
                <Ionicons name="search-outline" size={40} color="#333" />
                <Text style={{ color: "#4b5563", fontSize: 14 }}>
                  No results found
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleNavigate(item.id)}
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <View
                  style={{
                    width: 56,
                    height: 72,
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={item.image}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      fontWeight: "600",
                      marginBottom: 2,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text style={{ color: "#6b7280", fontSize: 12 }}>
                    {item.sub}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#444" />
              </TouchableOpacity>
            )}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  )
}
