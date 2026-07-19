import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { Coins } from "lucide-react-native"
import { Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../../../constants/theme"

export function HomeHeader() {
  return (
    <View className="flex-row items-center gap-2.5 px-5 pt-14 pb-3">
      <Text className="shrink-0 font-black text-white tracking-[-0.4]">
        Sable <Text className="-ml-1 text-primary tracking-[-0.4]">TV</Text>
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/dashboard/search")}
        accessibilityLabel="Search"
        className="min-w-0 flex-1 flex-row items-center gap-2 rounded-full bg-muted px-3 py-2.5"
      >
        <Ionicons name="search-outline" size={16} color="#888" />
        <Text
          className="flex-1 font-medium text-[11px] text-foreground"
          numberOfLines={1}
        >
          Search series, movies...
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/dashboard/notifications")}
        accessibilityLabel="Notifications"
        className="relative h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted"
      >
        <Ionicons name="notifications-outline" size={20} color="#fff" />
        <View className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1">
          <Text className="pt-0.5 font-semibold text-[9px] text-white leading-none">
            3
          </Text>
        </View>
      </TouchableOpacity>

      <View className="shrink-0 flex-row items-center gap-1.5 rounded-full bg-muted px-3 py-2">
        <Coins size={14} color={COLORS.primary} strokeWidth={2} />
        <Text className="font-semibold text-primary text-xs">320</Text>
      </View>
    </View>
  )
}
