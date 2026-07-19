import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import * as SecureStore from "expo-secure-store"
import { useState } from "react"
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { COLORS } from "../../constants/theme"

const { width } = Dimensions.get("window")

const CARD_WIDTH = width * 0.54
const CARD_HEIGHT = CARD_WIDTH * 1.55
const SIDE_WIDTH = width * 0.3
const SIDE_HEIGHT = SIDE_WIDTH * 1.5
const CARD_OVERLAP = width * 0.08
const CENTER_BORDER_RADIUS = 24
const SIDE_BORDER_RADIUS = 16

/** Figma: x0 y25 blur50 spread-12 #7F67FF 40% */
const CENTER_CARD_DROP_SHADOW = {
  shadowColor: COLORS.primary,
  shadowOffset: { width: 0, height: 25 },
  shadowOpacity: 0.3,
  shadowRadius: 25,
  elevation: 10,
} as const

const FILMS = [
  {
    id: "1",
    title: "The Returnees",
    image: require("../../../assets/images/movie-1.png"),
  },
  {
    id: "2",
    title: "Golden Coast",
    image: require("../../../assets/images/movie-1.png"),
  },
  {
    id: "3",
    title: "Market Queens",
    image: require("../../../assets/images/movie-1.png"),
  },
  {
    id: "4",
    title: "Shadow Market",
    image: require("../../../assets/images/movie-1.png"),
  },
  {
    id: "5",
    title: "Mama's Kitchen",
    image: require("../../../assets/images/movie-1.png"),
  },
]

export default function OnboardingWelcome() {
  const [centerIndex, setCenterIndex] = useState(0)
  const opacity = useSharedValue(1)

  const handleStart = async () => {
    await SecureStore.setItemAsync("hasOnboarded", "true").catch(() => {})
    router.replace("/dashboard/home")
  }

  const navigate = (direction: "next" | "prev") => {
    opacity.value = withTiming(0, { duration: 200 }, (done) => {
      if (done) opacity.value = withTiming(1, { duration: 200 })
    })
    setCenterIndex((prev) =>
      direction === "next"
        ? (prev + 1) % FILMS.length
        : (prev - 1 + FILMS.length) % FILMS.length
    )
  }

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  const getFilm = (offset: number) =>
    FILMS[(centerIndex + offset + FILMS.length) % FILMS.length]

  return (
    <View className="flex-1 bg-background pt-12">
      <View className="mb-5 px-5">
        {/* Progress */}
        <View className="mb-16">
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
              STEP 2 OF 2
            </Text>

            <Text className="w-10 text-right font-semibold text-primary text-xs">
              100%
            </Text>
          </View>
          <View className="h-1.5 rounded-full bg-gray-800">
            <View
              className="h-1.5 rounded-full bg-primary"
              style={{ width: "100%" }}
            />
          </View>
        </View>

        {/* Heading — sits just above the carousel */}
        <View className="mb-4 items-center">
          <Text className="mb-2 font-bold text-2xl text-white">
            You're All Set!
          </Text>
          <Text className="text-center text-foreground text-sm leading-5">
            We've tailored your experience based on{"\n"}your picks. Enjoy
            watching!
          </Text>
        </View>
      </View>

      {/* Fan */}
      <View className="items-center px-5" style={{ overflow: "visible" }}>
        <Animated.View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              height: CARD_HEIGHT,
            },
            fadeStyle,
          ]}
        >
          {/* Left — tap to go prev */}
          <TouchableOpacity
            onPress={() => navigate("prev")}
            activeOpacity={0.8}
            style={{
              width: SIDE_WIDTH,
              height: SIDE_HEIGHT,
              borderRadius: SIDE_BORDER_RADIUS,
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            <Image
              source={getFilm(-1).image}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.55)",
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 8,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 10, fontWeight: "600" }}
                numberOfLines={2}
              >
                {getFilm(-1).title.toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Center — overlaps side cards with drop shadow + outline */}
          <View
            style={{
              zIndex: 3,
              marginHorizontal: -CARD_OVERLAP,
              overflow: "visible",
            }}
          >
            <View
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                borderRadius: CENTER_BORDER_RADIUS,
                ...CENTER_CARD_DROP_SHADOW,
              }}
            >
              <View
                style={{
                  flex: 1,
                  borderRadius: CENTER_BORDER_RADIUS,
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                  overflow: "hidden",
                  backgroundColor: "#000",
                }}
              >
                <Image
                  source={getFilm(0).image}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    padding: 12,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 13,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {getFilm(0).title.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Right — tap to go next */}
          <TouchableOpacity
            onPress={() => navigate("next")}
            activeOpacity={0.8}
            style={{
              width: SIDE_WIDTH,
              height: SIDE_HEIGHT,
              borderRadius: SIDE_BORDER_RADIUS,
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            <Image
              source={getFilm(1).image}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 8,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 10, fontWeight: "600" }}
                numberOfLines={2}
              >
                {getFilm(1).title.toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Dots */}
      </View>

      <View className="flex-1" />

      {/* CTA */}
      <View className="px-5 pb-10">
        <TouchableOpacity
          onPress={handleStart}
          className="items-center rounded-xl bg-primary py-3.5"
        >
          <Text className="font-bold text-base text-white">Start Watching</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
