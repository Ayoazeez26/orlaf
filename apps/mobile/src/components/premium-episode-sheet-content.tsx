import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { Coins, Crown } from "lucide-react-native"
import { Pressable, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../constants/theme"

const PREMIUM_GRADIENT = ["#7F67FF", "#9754ED"] as const
const COINS_PER_EPISODE = 50

type PremiumEpisodeSheetContentProps = {
  episode: number
  userCoins?: number
  onClose: () => void
  onUnlockAll?: () => void
  onBuyCoins?: () => void
  onWatchAd?: () => void
}

function ActionPill({ label }: { label: string }) {
  return (
    <View className="rounded-full bg-primary/20 px-3 py-1.5">
      <Text className="font-semibold text-[11px] text-primary">{label}</Text>
    </View>
  )
}

export function PremiumEpisodeSheetContent({
  episode,
  userCoins = 10,
  onClose,
  onUnlockAll,
  onBuyCoins,
  onWatchAd,
}: PremiumEpisodeSheetContentProps) {
  return (
    <View className="bg-[#080811] px-4 pt-4 pb-16">
      <View className="mb-5 flex-row items-start justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/20">
            <Ionicons name="lock-closed" size={20} color={COLORS.primary} />
          </View>
          <View>
            <Text className="font-semibold text-[11px] text-primary tracking-wider">
              PREMIUM CONTENT
            </Text>
            <Text className="font-bold text-white text-xl">
              Episode {episode}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onClose}
          accessibilityLabel="Close"
          className="h-8 w-8 items-center justify-center rounded-full bg-white/10"
        >
          <Ionicons name="close" size={18} color="#888" />
        </TouchableOpacity>
      </View>

      <Text className="mb-6 text-center text-[15px] text-white/55">
        Unlock Episode {episode} to continue watching
      </Text>

      <View className="gap-3">
        <Pressable
          onPress={onUnlockAll}
          className="overflow-hidden rounded-2xl"
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <LinearGradient
            colors={[...PREMIUM_GRADIENT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ padding: 16 }}
          >
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-white/20">
                <Crown size={20} color="#fff" strokeWidth={2} />
              </View>
              <View className="min-w-0 flex-1">
                <Text className="font-bold text-[#FCFCFC] text-[15px]">
                  Unlock All Episodes
                </Text>
                <Text className="text-[#FFFFFFD9] text-xs">
                  Subscribe to Sable TV Premium
                </Text>
              </View>
              <Crown size={18} color="#fff" strokeWidth={2} />
            </View>
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={onBuyCoins}
          className="flex-row items-center gap-3 rounded-3xl border border-[#2E2E2E] bg-[#080811] p-3"
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <View className="h-11 w-11 items-center justify-center rounded-full bg-white/10">
            <Coins size={20} color="#fff" strokeWidth={2} />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="font-bold text-[15px] text-white">Buy Coins</Text>
            <Text className="text-[#8C8E9C] text-xs">
              {COINS_PER_EPISODE} coins per episode · You have {userCoins}
            </Text>
          </View>
          <ActionPill label="TOP UP" />
        </Pressable>

        <Pressable
          onPress={() => onWatchAd?.()}
          className="flex-row items-center gap-3 rounded-3xl border border-[#2E2E2E] bg-[#080811] p-3"
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <View className="h-11 w-11 items-center justify-center rounded-full bg-white/10">
            <Ionicons name="play" size={18} color="#fff" />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="font-bold text-[15px] text-white">
              Watch Ad to Unlock
            </Text>
            <Text className="text-[#8C8E9C] text-xs">
              ~30s full-screen ad · Unlock this episode free
            </Text>
          </View>
          <ActionPill label="FREE" />
        </Pressable>
      </View>
    </View>
  )
}
