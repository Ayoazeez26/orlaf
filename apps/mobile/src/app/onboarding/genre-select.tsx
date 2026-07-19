import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState } from "react"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../../constants/theme"

const GENRES = [
  "Nollywood",
  "Action",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Epic",
  "Fantasy",
  "Horror",
  "Music",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Drama",
  "Noir",
]

const FILMS = [
  {
    id: "1",
    title: "The Kingdom Falls",
    image: require("../../../assets/images/movie-1.png"),
  },
  {
    id: "2",
    title: "Lagos After Dark",
    image: require("../../../assets/images/movie-2.png"),
  },
  {
    id: "3",
    title: "Heartbeat of Accra",
    image: require("../../../assets/images/movie-3.png"),
  },
  {
    id: "4",
    title: "Shadow Market",
    image: require("../../../assets/images/movie-4.png"),
  },
  {
    id: "5",
    title: "Mama's Kitchen",
    image: require("../../../assets/images/movie-2.png"),
  },
  {
    id: "6",
    title: "Warrior Queen",
    image: require("../../../assets/images/movie-3.png"),
  },
]

const TOTAL_STEPS = 2
const CURRENT_STEP = 1

export default function GenreSelect() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedFilms, setSelectedFilms] = useState<string[]>([])

  const toggleGenre = (g: string) =>
    setSelectedGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    )

  const toggleFilm = (f: string) =>
    setSelectedFilms((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    )

  const progress = (CURRENT_STEP / TOTAL_STEPS) * 100

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingTop: 52 }}
      >
        {/* Progress bar header */}
        <View className="mb-8">
          <View className="mb-4 flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Go back"
              className="h-10 w-10 items-center justify-center rounded-full bg-muted"
            >
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </TouchableOpacity>

            <Text className="flex-1 text-center font-semibold text-foreground text-xs tracking-wide">
              STEP {CURRENT_STEP} OF {TOTAL_STEPS}
            </Text>

            <Text className="w-10 text-right font-semibold text-primary text-xs">
              {progress}%
            </Text>
          </View>
          <View className="h-1.5 rounded-full bg-gray-800">
            <View
              className="h-1.5 rounded-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>

        <Text className="mb-1 font-bold text-2xl text-white">
          What do you love?
        </Text>
        <Text className="mb-5 text-foreground text-sm">
          Pick your genres — we'll tailor your feed
        </Text>

        {/* Genre chips */}
        <View className="mb-6 flex-row flex-wrap gap-2">
          {GENRES.map((g) => (
            <TouchableOpacity
              key={g}
              onPress={() => toggleGenre(g)}
              className={`rounded-full border px-4 py-2 ${
                selectedGenres.includes(g)
                  ? "bg-primary"
                  : "border-[#2E2E2E] bg-[#080811]"
              }`}
            >
              <Text
                className={`text-sm ${
                  selectedGenres.includes(g)
                    ? "font-medium text-white"
                    : "text-[#F8F8F8CC]"
                }`}
              >
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="mb-1 font-semibold text-lg text-white">
          Series & Films
        </Text>
        <Text className="mb-3 text-foreground text-sm">
          Select a few you would like to watch
        </Text>

        {/* Film grid */}
        <View className="mb-8 flex-row flex-wrap">
          {FILMS.map((f) => (
            <View key={f.id} style={{ width: "33.33%", padding: 4 }}>
              <TouchableOpacity
                onPress={() => toggleFilm(f.id)}
                className={`overflow-hidden rounded-xl border ${
                  selectedFilms.includes(f.id)
                    ? "border-primary"
                    : "border-transparent"
                }`}
              >
                {/* Image */}
                <View style={{ height: 200 }}>
                  <Image
                    source={f.image}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                  {/* Full black overlay */}
                  <View className="absolute inset-0 bg-black/20" />

                  {/* Checkmark */}
                  {selectedFilms.includes(f.id) && (
                    <View className="absolute top-2 right-2">
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={COLORS.primary}
                      />
                    </View>
                  )}
                </View>

                {/* Title below image */}
                <Text className="mt-1.5 px-1 font-semibold text-foreground text-xs">
                  {f.title}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="border-gray-900 border-t px-5 pt-3 pb-10">
        <TouchableOpacity
          onPress={() => {
            if (selectedGenres.length > 0) router.push("/onboarding/welcome")
          }}
          disabled={selectedGenres.length === 0}
          className={`items-center rounded-xl py-3.5 ${
            selectedGenres.length > 0 ? "bg-primary" : "bg-muted"
          }`}
        >
          <Text
            className={`font-semibold text-base ${
              selectedGenres.length > 0 ? "text-white" : "text-gray-500"
            }`}
          >
            Next
          </Text>
        </TouchableOpacity>
        {selectedGenres.length === 0 && (
          <Text className="mt-4 text-center text-[#888888] text-xs">
            Select at least 1 genre to continue
          </Text>
        )}
      </View>
    </View>
  )
}
