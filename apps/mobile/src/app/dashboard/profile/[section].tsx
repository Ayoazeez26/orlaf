import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"

const SECTION_TITLES: Record<string, string> = {
  account: "Account & Profile",
  rewards: "Rewards",
  library: "Library",
  membership: "Membership",
  "buy-coins": "Buy Coins",
  downloads: "Downloads",
  "invite-earn": "Invite & Earn",
  episodes: "Episodes",
  series: "Series",
  "coins-total": "Coins Total",
  subscriptions: "Subscriptions",
  "purchase-history": "Purchase History",
  "followed-creators": "Followed Creators",
  "privacy-security": "Privacy & Security",
  "help-support": "Help & Support",
  "app-settings": "App Settings",
}

export default function ProfileSectionPlaceholder() {
  const { section } = useLocalSearchParams<{ section: string }>()
  const title = SECTION_TITLES[section ?? ""] ?? "Settings"

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 px-5 pt-14 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color="#ccc" />
        </TouchableOpacity>
        <Text className="font-bold text-white text-xl">{title}</Text>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-center text-foreground text-sm">
          This section is coming soon.
        </Text>
      </View>
    </View>
  )
}
