import { router } from "expo-router"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../../constants/theme"

const POSTER_IMAGES = [
  require("../../../assets/images/movie-1.png"),
  require("../../../assets/images/movie-2.png"),
  require("../../../assets/images/movie-3.png"),
  require("../../../assets/images/movie-4.png"),
  require("../../../assets/images/palm-wine-movie.png"),
] as const

const POSTER_GRID = Array.from({ length: 12 }, (_, index) => ({
  id: `poster-${index}`,
  source: POSTER_IMAGES[index % POSTER_IMAGES.length],
}))

const POSTER_ROWS = [
  { id: "row-1", posters: POSTER_GRID.slice(0, 4) },
  { id: "row-2", posters: POSTER_GRID.slice(4, 8) },
  { id: "row-3", posters: POSTER_GRID.slice(8, 12) },
]

const POSTER_SIZE = 72

export default function OnboardingStart() {
  return (
    <View className="flex-1 bg-background px-6 pt-16 pb-10">
      {/* Poster grid */}
      <View className="mb-10">
        {POSTER_ROWS.map((row, rowIndex) => (
          <View
            key={row.id}
            className="flex-row items-center justify-between"
            style={{ marginBottom: rowIndex < POSTER_ROWS.length - 1 ? 16 : 0 }}
          >
            {row.posters.map((poster) => (
              <View
                key={poster.id}
                className="overflow-hidden rounded-full bg-muted"
                style={{ width: POSTER_SIZE, height: POSTER_SIZE }}
              >
                <Image
                  source={poster.source}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Title block — spaced above bottom actions */}
      <View className="flex-1 justify-start">
        <Text className="mb-3 text-center font-bold text-3xl text-white">
          Make Sable TV Yours
        </Text>
        <Text className="text-pretty text-center text-foreground text-sm leading-5">
          Tell us what you enjoy watching and get a customized Sable TV
          experience
        </Text>
      </View>

      {/* Bottom actions */}
      <View>
        <TouchableOpacity
          onPress={() => router.push("/onboarding/genre-select")}
          className="mb-3 h-12 items-center justify-center rounded-xl bg-primary"
          style={{
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Text className="font-semibold text-base text-white">Let's Go</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace("/dashboard/home")}
          className="items-center py-2"
        >
          <Text className="text-foreground text-sm">Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
