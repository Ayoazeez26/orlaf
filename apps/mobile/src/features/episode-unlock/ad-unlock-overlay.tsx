import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { AD_UNLOCK_DURATION_SECONDS } from "./types"

type AdUnlockOverlayProps = {
  visible: boolean
  episodeNumber: number
  durationSeconds?: number
  onComplete: () => void
}

export function AdUnlockOverlay({
  visible,
  episodeNumber,
  durationSeconds = AD_UNLOCK_DURATION_SECONDS,
  onComplete,
}: AdUnlockOverlayProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds)
  const [muted, setMuted] = useState(false)

  const canContinue = remainingSeconds === 0
  const progress =
    durationSeconds > 0
      ? (durationSeconds - remainingSeconds) / durationSeconds
      : 1

  useEffect(() => {
    if (!visible) {
      setRemainingSeconds(durationSeconds)
      setMuted(false)
      return
    }

    setRemainingSeconds(durationSeconds)
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [visible, durationSeconds])

  if (!visible) return null

  return (
    <LinearGradient
      colors={["#7F67FF", "#5B3FCC", "#1E1248"]}
      locations={[0, 0.45, 1]}
      style={styles.fill}
    >
      <SafeAreaView style={styles.fill} edges={["top", "bottom"]}>
        <View style={styles.fill} className="px-5">
          <View className="flex-row items-center justify-between pt-2">
            <View className="rounded-full bg-black/40 px-3 py-1.5">
              <Text className="font-semibold text-[11px] text-white tracking-wide">
                SPONSORED
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() => setMuted((m) => !m)}
                accessibilityLabel={muted ? "Unmute ad" : "Mute ad"}
                className="h-9 w-9 items-center justify-center rounded-full bg-black/40"
              >
                <Ionicons
                  name={muted ? "volume-mute" : "volume-high"}
                  size={18}
                  color="#fff"
                />
              </TouchableOpacity>
              <View className="h-9 min-w-9 items-center justify-center rounded-full bg-black/40 px-2.5">
                <Text className="font-semibold text-sm text-white tabular-nums">
                  {remainingSeconds}s
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-1 items-center justify-center">
            <View className="w-full max-w-[320px]">
              <View className="absolute -top-5 left-1/2 z-10 -ml-5 h-10 w-10 items-center justify-center rounded-xl bg-[#9B84FF]">
                <Text className="font-bold text-lg text-white">S</Text>
              </View>

              <View className="overflow-hidden rounded-3xl border border-white/20 bg-white/10">
                <View className="min-h-[280px] justify-between p-5 pt-10">
                  <View className="items-center">
                    <Text className="font-bold text-2xl text-white/90">
                      Sample Ad
                    </Text>
                    <Text className="mt-1 text-center text-sm text-white/50">
                      Africa&apos;s fastest 5G network.
                    </Text>
                  </View>

                  <View>
                    <Text className="mb-1 font-semibold text-[11px] text-white/70 tracking-wider">
                      LIMITED OFFER
                    </Text>
                    <Text className="font-bold text-[22px] text-white leading-tight">
                      Unlimited data. No throttling. One plan.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className="pb-2">
            <TouchableOpacity
              onPress={onComplete}
              disabled={!canContinue}
              activeOpacity={canContinue ? 0.85 : 1}
              className="mb-4 items-center rounded-full bg-white py-4"
              style={{ opacity: canContinue ? 1 : 0.55 }}
            >
              <Text className="font-semibold text-base text-black">
                Continue
              </Text>
            </TouchableOpacity>

            <Text className="mb-4 text-center text-sm text-white/80">
              Episode {episodeNumber} unlocks when the ad ends
              {remainingSeconds > 0 ? ` · ${remainingSeconds}s left` : ""}
            </Text>

            <View className="h-1 overflow-hidden rounded-full bg-white/20">
              <View
                className="h-1 rounded-full bg-white"
                style={{ width: `${progress * 100}%` }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
})
