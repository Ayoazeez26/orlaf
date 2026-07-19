import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import type { ComponentProps } from "react"
import { useState } from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../../constants/theme"

type IconName = ComponentProps<typeof Ionicons>["name"]

type NotificationItem = {
  id: string
  title: string
  time: string
  description: string
  icon: IconName
  iconColor: string
  iconBg: string
  unread?: boolean
}

const TODAY_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "new-episode",
    title: "New episode out",
    time: "12M AGO",
    description: "Palm Wine Days · Episode 4 just dropped.",
    icon: "play",
    iconColor: COLORS.primary,
    iconBg: "rgba(127, 103, 255, 0.15)",
    unread: true,
  },
  {
    id: "gift-sent",
    title: "Your gift was sent 🎁",
    time: "2H AGO",
    description:
      "AfriStream received your Rose. Thanks for supporting creators!",
    icon: "gift-outline",
    iconColor: "#EF4444",
    iconBg: "rgba(239, 68, 68, 0.15)",
    unread: true,
  },
  {
    id: "comment-reply",
    title: "New reply to your comment",
    time: "6H AGO",
    description: 'Ada: "Totally agree, that twist was wild!"',
    icon: "chatbubble-outline",
    iconColor: "#3B82F6",
    iconBg: "rgba(59, 130, 246, 0.15)",
    unread: true,
  },
]

const EARLIER_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "picked-for-you",
    title: "Picked for you",
    time: "1D AGO",
    description: "Because you watched Romance — try Lagos Glamour.",
    icon: "sparkles",
    iconColor: "#F97316",
    iconBg: "rgba(249, 115, 22, 0.15)",
  },
  {
    id: "coins-claimed",
    title: "+50 coins claimed",
    time: "1D AGO",
    description: "Daily streak bonus is ready in Rewards.",
    icon: "cash-outline",
    iconColor: "#22C55E",
    iconBg: "rgba(34, 197, 94, 0.15)",
  },
]

const NOTIFICATION_PREFERENCES_ROUTE = "/dashboard/profile/app-settings"

function NotificationRow({
  item,
  isLast,
}: {
  item: NotificationItem
  isLast: boolean
}) {
  return (
    <View
      className={`flex-row gap-3 px-4 py-4 ${
        isLast ? "" : "border-white/5 border-b"
      }`}
    >
      <View className="relative">
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: item.iconBg }}
        >
          <Ionicons name={item.icon} size={18} color={item.iconColor} />
        </View>
        {item.unread ? (
          <View
            className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#141414]"
            style={{ backgroundColor: COLORS.primary }}
          />
        ) : null}
      </View>

      <View className="min-w-0 flex-1">
        <View className="mb-1 flex-row items-start justify-between gap-2">
          <Text className="flex-1 font-semibold text-sm text-white">
            {item.title}
          </Text>
          <Text className="shrink-0 text-[#8C8E9C] text-[10px] tracking-wide">
            {item.time}
          </Text>
        </View>
        <Text className="text-[#8C8E9C] text-sm leading-5">
          {item.description}
        </Text>
      </View>
    </View>
  )
}

function NotificationGroup({
  title,
  items,
}: {
  title: string
  items: NotificationItem[]
}) {
  return (
    <View className="mb-6">
      <Text className="mb-2 px-1 font-bold text-[#8C8E9C] text-[11px] tracking-[1.5px]">
        {title}
      </Text>
      <View className="overflow-hidden rounded-3xl bg-[#141414]">
        {items.map((item, index) => (
          <NotificationRow
            key={item.id}
            item={item}
            isLast={index === items.length - 1}
          />
        ))}
      </View>
    </View>
  )
}

export default function NotificationsScreen() {
  const [todayItems, setTodayItems] = useState(TODAY_NOTIFICATIONS)

  const unreadCount = todayItems.filter((item) => item.unread).length

  const handleMarkAllRead = () => {
    setTodayItems((items) => items.map((item) => ({ ...item, unread: false })))
  }

  return (
    <View className="flex-1 bg-black">
      <View className="flex-row items-center justify-between px-5 pt-14 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <Text className="font-bold text-lg text-white">Notifications</Text>

        <TouchableOpacity
          onPress={handleMarkAllRead}
          disabled={unreadCount === 0}
          accessibilityLabel="Mark all read"
        >
          <Text
            className="font-semibold text-sm"
            style={{
              color: unreadCount > 0 ? COLORS.primary : "#555",
            }}
          >
            ✓ Mark all read
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        <NotificationGroup title="TODAY" items={todayItems} />
        <NotificationGroup title="EARLIER" items={EARLIER_NOTIFICATIONS} />

        <TouchableOpacity
          onPress={() => router.push(NOTIFICATION_PREFERENCES_ROUTE)}
          className="flex-row items-center gap-3 rounded-3xl bg-[#141414] px-4 py-4"
          accessibilityLabel="Notification preferences"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <Ionicons name="notifications-outline" size={18} color="#fff" />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="mb-0.5 font-semibold text-sm text-white">
              Notification preferences
            </Text>
            <Text className="text-[#8C8E9C] text-sm">
              Choose what shows up here.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#666" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
