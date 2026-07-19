import { Ionicons } from "@expo/vector-icons"
import { type Href, router, usePathname } from "expo-router"
import { Library } from "lucide-react-native"
import type { ComponentProps } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../constants/theme"

type IconName = ComponentProps<typeof Ionicons>["name"]

const TABS: {
  label: string
  icon?: IconName
  activeIcon?: IconName
  lucideIcon?: "library"
  route: Href
}[] = [
  {
    label: "Home",
    icon: "home-outline",
    activeIcon: "home",
    route: "/dashboard/home",
  },
  {
    label: "For You",
    icon: "sparkles-outline",
    activeIcon: "sparkles",
    route: "/dashboard/for-you",
  },
  {
    label: "Search",
    icon: "search-outline",
    activeIcon: "search",
    route: "/dashboard/search",
  },
  {
    label: "Library",
    lucideIcon: "library",
    route: "/dashboard/library",
  },
  {
    label: "More",
    icon: "grid-outline",
    route: "/dashboard/profile",
  },
]

export default function TabBar() {
  const pathname = usePathname()

  return (
    <View className="flex-row justify-around border-gray-900 border-t bg-[#0a0a0f] py-3">
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.route as string)
        const iconName = active && tab.activeIcon ? tab.activeIcon : tab.icon

        return (
          <TouchableOpacity
            key={tab.label}
            onPress={() => router.push(tab.route)}
            className="flex-1 items-center gap-1"
          >
            {tab.lucideIcon === "library" ? (
              <Library
                size={22}
                color={active ? COLORS.primary : "#555"}
                strokeWidth={active ? 2.5 : 2}
              />
            ) : iconName ? (
              <Ionicons
                name={iconName}
                size={22}
                color={active ? COLORS.primary : "#555"}
              />
            ) : null}
            <Text
              className={`text-xs ${active ? "text-primary" : "text-gray-600"}`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
