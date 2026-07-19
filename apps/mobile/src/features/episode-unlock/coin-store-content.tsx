import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { Coins } from "lucide-react-native"
import { useState } from "react"
import { Dimensions, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../../constants/theme"
import {
  COIN_PACKAGES,
  type CoinPackage,
  DEFAULT_COIN_PACKAGE_ID,
  MOCK_COIN_BALANCE,
} from "./types"

const SCREEN_WIDTH = Dimensions.get("window").width
const GRID_GAP = 12
const HORIZONTAL_PADDING = 32
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING - GRID_GAP) / 2

type CoinStoreContentProps = {
  onClose: () => void
  onPurchase: (pkg: CoinPackage) => void
  balance?: number
}

function CoinPackageCard({
  pkg,
  isSelected,
  onSelect,
}: {
  pkg: CoinPackage
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.85}
      style={{ width: CARD_WIDTH }}
      className={`relative rounded-2xl border p-4 ${
        isSelected
          ? "border-primary bg-primary/10"
          : "border-[#2E2E2E] bg-[#10111A]"
      }`}
    >
      {"popular" in pkg && pkg.popular ? (
        <View className="absolute -top-2.5 right-0 left-0 items-center">
          <View className="rounded-full bg-primary px-2.5 py-0.5">
            <Text className="font-semibold text-[10px] text-white tracking-wide">
              POPULAR
            </Text>
          </View>
        </View>
      ) : null}

      {isSelected ? (
        <View className="absolute top-2.5 right-2.5 h-5 w-5 items-center justify-center rounded-full bg-primary">
          <Ionicons name="checkmark" size={12} color="#fff" />
        </View>
      ) : null}

      <View className="mb-3 items-center pt-1">
        <Coins size={22} color={COLORS.primary} strokeWidth={2} />
      </View>

      <View className="items-center">
        <Text className="font-bold text-2xl text-white">{pkg.coins}</Text>
        <Text className="text-[#8C8E9C] text-xs">coins</Text>
      </View>

      {"bonus" in pkg && pkg.bonus ? (
        <View className="mt-2 mb-2 items-center">
          <View className="rounded-full bg-primary/20 px-2 py-0.5">
            <Text className="font-medium text-[10px] text-primary">
              Bonus {pkg.bonus}
            </Text>
          </View>
        </View>
      ) : null}

      <Text
        className={`text-center font-semibold text-sm text-white ${
          "bonus" in pkg && pkg.bonus ? "" : "mt-2"
        }`}
      >
        {pkg.price}
      </Text>
    </TouchableOpacity>
  )
}

export function CoinStoreContent({
  onClose,
  onPurchase,
  balance = MOCK_COIN_BALANCE,
}: CoinStoreContentProps) {
  const [selectedPackageId, setSelectedPackageId] = useState(
    DEFAULT_COIN_PACKAGE_ID
  )

  const selectedPackage =
    COIN_PACKAGES.find((pkg) => pkg.id === selectedPackageId) ??
    COIN_PACKAGES[1]

  return (
    <View className="px-4 pt-2 pb-10">
      <View className="mb-6 flex-row items-start justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/20">
            <Coins size={20} color={COLORS.primary} strokeWidth={2} />
          </View>
          <View>
            <Text className="font-semibold text-[11px] text-primary tracking-wider">
              COIN STORE
            </Text>
            <Text className="font-bold text-white text-xl">Buy Coins</Text>
            <Text className="text-[#8C8E9C] text-xs">
              Balance · {balance} coins
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

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: GRID_GAP,
          marginBottom: 24,
        }}
      >
        {COIN_PACKAGES.map((pkg) => (
          <CoinPackageCard
            key={pkg.id}
            pkg={pkg}
            isSelected={selectedPackageId === pkg.id}
            onSelect={() => setSelectedPackageId(pkg.id)}
          />
        ))}
      </View>

      <TouchableOpacity
        onPress={() => onPurchase(selectedPackage)}
        activeOpacity={0.85}
        className="mb-4 overflow-hidden rounded-2xl"
      >
        <LinearGradient
          colors={["#7F67FF", "#9754ED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ paddingVertical: 12 }}
        >
          <View className="flex-row items-center justify-center gap-2">
            <Coins size={18} color="#fff" strokeWidth={2} />
            <Text className="font-bold text-base text-white">Buy Coins</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <Text className="text-center text-[#8C8E9C] text-xs">
        Coins auto-unlock locked episodes
      </Text>
    </View>
  )
}
