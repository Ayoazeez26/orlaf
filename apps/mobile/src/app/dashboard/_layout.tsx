import { Ionicons } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import { Library } from "lucide-react-native"
import type { ColorValue } from "react-native"

type IconName = React.ComponentProps<typeof Ionicons>["name"]

function TabIcon({ name, color }: { name: IconName; color: ColorValue }) {
  return <Ionicons name={name} size={22} color={color} />
}

function LibraryTabIcon({
  color,
  focused,
}: {
  color: ColorValue
  focused: boolean
}) {
  return <Library size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
}

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0a0a0f",
          borderTopColor: "#1a1a2e",
          borderTopWidth: 0.5,
          height: 70,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#555",
        tabBarLabelStyle: {
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "home" : "home-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="for-you"
        options={{
          tabBarLabel: "For You",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? "play-circle-outline" : "play-circle-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          tabBarLabel: "Library",
          tabBarIcon: ({ color, focused }) => (
            <LibraryTabIcon color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "More",
          tabBarIcon: ({ color }) => (
            <TabIcon name="grid-outline" color={color} />
          ),
        }}
      />
      {/* Hide movie screens from tab bar */}
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen
        name="notifications"
        options={{ href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen name="movie" options={{ href: null }} />
      <Tabs.Screen name="creator/[id]" options={{ href: null }} />
      <Tabs.Screen
        name="series/[id]"
        options={{ href: null, tabBarStyle: { display: "none" } }}
      />
    </Tabs>
  )
}
