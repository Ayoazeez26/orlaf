import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import type { ComponentProps } from "react"
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../../../constants/theme"
import { useAuth } from "../../../context/auth-context"

const PREMIUM_BORDER_COLOR = COLORS.primaryBorder
const PREMIUM_GRADIENT_COLORS = [
  COLORS.primaryGradientStart,
  COLORS.primaryGradientEnd,
] as const

type IconName = ComponentProps<typeof Ionicons>["name"]

const USER = {
  initials: "AO",
  name: "Adaeze Okafor",
  plan: "FREE",
  handle: "@adaeze_explorer",
  coins: 320,
  streak: 3,
}

type QuickAccessItem = {
  id: string
  title: string
  subtitle: string
  icon: IconName
  route: string
  badge?: string
  stat?: boolean
}

const QUICK_ACCESS: QuickAccessItem[] = [
  {
    id: "rewards",
    title: "Rewards",
    subtitle: "320 coins",
    icon: "disc-outline",
    route: "rewards",
    badge: "Claim",
  },
  {
    id: "library",
    title: "Library",
    subtitle: "Downloads & Lis...",
    icon: "albums-outline",
    route: "library",
  },
  {
    id: "membership",
    title: "Membership",
    subtitle: "Free plan",
    icon: "diamond-outline",
    route: "membership",
    badge: "Upgrade",
  },
  {
    id: "buy-coins",
    title: "Buy Coins",
    subtitle: "Unlock episodes",
    icon: "flash-outline",
    route: "buy-coins",
  },
  {
    id: "downloads",
    title: "Downloads",
    subtitle: "7 items",
    icon: "download-outline",
    route: "downloads",
  },
  {
    id: "invite-earn",
    title: "Invite & Earn",
    subtitle: "+100 coins/friend",
    icon: "gift-outline",
    route: "invite-earn",
  },
]

const STATS_ACCESS: QuickAccessItem[] = [
  {
    id: "episodes",
    title: "48",
    subtitle: "episodes",
    icon: "play-outline",
    route: "episodes",
    stat: true,
  },
  {
    id: "series",
    title: "12",
    subtitle: "series",
    icon: "star-outline",
    route: "series",
    stat: true,
  },
  {
    id: "coins-total",
    title: "1.2K",
    subtitle: "coins total",
    icon: "trending-up-outline",
    route: "coins-total",
    stat: true,
  },
]

const GUEST_QUICK_ACCESS: QuickAccessItem[] = [
  {
    id: "rewards",
    title: "Rewards",
    subtitle: "Sign in required",
    icon: "disc-outline",
    route: "rewards",
  },
  {
    id: "library",
    title: "Library",
    subtitle: "Sign in required",
    icon: "albums-outline",
    route: "library",
  },
  {
    id: "membership",
    title: "Membership",
    subtitle: "Sign in required",
    icon: "diamond-outline",
    route: "membership",
  },
  {
    id: "buy-coins",
    title: "Buy Coins",
    subtitle: "Sign in required",
    icon: "flash-outline",
    route: "buy-coins",
  },
  {
    id: "downloads",
    title: "Downloads",
    subtitle: "Sign in required",
    icon: "download-outline",
    route: "downloads",
  },
  {
    id: "invite-earn",
    title: "Invite & Earn",
    subtitle: "Sign in required",
    icon: "gift-outline",
    route: "invite-earn",
  },
]

type AccountItem = {
  id: string
  title: string
  subtitle?: string
  icon: IconName
  route?: string
  destructive?: boolean
}

const ACCOUNT_PRIMARY: AccountItem = {
  id: "account",
  title: "Account & Profile",
  subtitle: "Edit info, avatar, handle",
  icon: "person-outline",
  route: "account",
}

const ACCOUNT_ITEMS: AccountItem[] = [
  {
    id: "subscriptions",
    title: "Subscriptions",
    subtitle: "Manage plan & billing",
    icon: "star-outline",
    route: "subscriptions",
  },
  {
    id: "purchase-history",
    title: "Purchase History",
    subtitle: "Episodes, coins, packs",
    icon: "bag-outline",
    route: "purchase-history",
  },
  {
    id: "followed-creators",
    title: "Followed Creators",
    subtitle: "4 creators",
    icon: "people-outline",
    route: "followed-creators",
  },
]

const SETTINGS_ITEMS: AccountItem[] = [
  {
    id: "playback",
    title: "Playback",
    subtitle: "Autoplay, quality, data saver",
    icon: "play-circle-outline",
    route: "playback",
  },
  {
    id: "appearance",
    title: "Appearance",
    subtitle: "Light, dark, system",
    icon: "contrast-outline",
    route: "appearance",
  },
  {
    id: "language",
    title: "Language",
    subtitle: "App & subtitles",
    icon: "globe-outline",
    route: "language",
  },
]

const SUPPORT_ITEMS: AccountItem[] = [
  {
    id: "help-support",
    title: "Help & Support",
    subtitle: "FAQs, contact us",
    icon: "help-circle-outline",
    route: "help-support",
  },
  {
    id: "about",
    title: "About",
    subtitle: "Version, terms, licenses",
    icon: "information-circle-outline",
    route: "about",
  },
  {
    id: "personalize-feed",
    title: "Personalize Feed",
    subtitle: "Re-run onboarding",
    icon: "star-outline",
    route: "personalize-feed",
  },
]

function navigateToSection(route: string) {
  router.push(`/dashboard/profile/${route}` as const)
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text className="mb-3 px-5 font-semibold text-[11px] text-foreground tracking-wider">
      {children}
    </Text>
  )
}

function QuickAccessCard({
  item,
  disabled,
}: {
  item: QuickAccessItem
  disabled?: boolean
}) {
  return (
    <TouchableOpacity
      onPress={() => !disabled && navigateToSection(item.route)}
      activeOpacity={disabled ? 1 : 0.7}
      className="relative min-h-27 flex-1 rounded-2xl border border-[#2E2E2E] bg-muted p-3"
      style={{ minWidth: "30%", opacity: disabled ? 0.6 : 1 }}
    >
      {item.badge && !disabled && (
        <View className="absolute top-2.5 right-2.5 rounded-md bg-primary px-1.5 py-0.5">
          <Text className="font-semibold text-[10px] text-white">
            {item.badge}
          </Text>
        </View>
      )}
      <Ionicons name={item.icon} size={18} color={disabled ? "#555" : "#888"} />
      {item.stat ? (
        <View className="mt-auto">
          <Text className="font-bold text-lg text-white">{item.title}</Text>
          <Text className="text-foreground text-xs">{item.subtitle}</Text>
        </View>
      ) : (
        <View className="mt-auto">
          <Text className="font-semibold text-sm text-white">{item.title}</Text>
          <Text className="text-foreground text-xs" numberOfLines={1}>
            {item.subtitle}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

function AccountRow({
  item,
  onPress,
}: {
  item: AccountItem
  onPress: () => void
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3.5"
    >
      <Ionicons
        name={item.icon}
        size={20}
        color={item.destructive ? "#E57373" : "#888"}
      />
      <View className="min-w-0 flex-1">
        <Text
          className={`font-medium text-sm ${item.destructive ? "text-[#E57373]" : "text-white"}`}
        >
          {item.title}
        </Text>
        {item.subtitle && (
          <Text className="text-foreground text-xs">{item.subtitle}</Text>
        )}
      </View>
      {!item.destructive && (
        <Ionicons name="chevron-forward" size={16} color="#444" />
      )}
    </TouchableOpacity>
  )
}

function ItemGroup({ items }: { items: AccountItem[] }) {
  return (
    <View className="mx-5 mb-3 overflow-hidden rounded-2xl border border-[#2E2E2E] bg-muted">
      {items.map((item, index) => (
        <View key={item.id}>
          {index > 0 && <View className="mx-4 h-px bg-[#2E2E2E]" />}
          <AccountRow
            item={item}
            onPress={() => item.route && navigateToSection(item.route)}
          />
        </View>
      ))}
    </View>
  )
}

function GuestHeader() {
  return (
    <View className="mx-5 mb-4 rounded-2xl border border-[#2E2E2E] bg-muted p-4">
      <View className="mb-4 flex-row items-start gap-3">
        <View className="h-14 w-14 items-center justify-center rounded-full border border-[#3A3A3A] bg-[#2A2A2A]">
          <Ionicons name="person-outline" size={24} color="#666" />
        </View>
        <View className="flex-1">
          <View className="mb-0.5 flex-row items-center gap-2">
            <Text className="font-bold text-base text-white">Guest</Text>
            <View className="rounded-md border border-[#3a3a3a] px-1.5 py-0.5">
              <Text className="font-medium text-[10px] text-foreground">
                NOT SIGNED IN
              </Text>
            </View>
          </View>
          <Text className="mb-1 text-foreground text-xs">guest_MQQOZQ</Text>
          <Text className="text-foreground text-xs leading-relaxed">
            Sign in to sync your library, coins & history across devices.
          </Text>
        </View>
      </View>
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => router.push("/auth/sign-in")}
          className="flex-1 items-center rounded-xl py-3"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Text className="font-semibold text-sm text-white">Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/auth/sign-in")}
          className="flex-1 items-center rounded-xl border border-[#3A3A3A] py-3"
        >
          <Text className="font-semibold text-sm text-white">
            Create account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function ProfileSettingsScreen() {
  // ─── Auth context ─────────────────────────────────────────────────────────
  const { isAuthenticated, signOut, user } = useAuth()
  const isGuest = !isAuthenticated

  function handleSignOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: signOut,
      },
    ])
  }

  const quickRows = isGuest
    ? [GUEST_QUICK_ACCESS.slice(0, 3), GUEST_QUICK_ACCESS.slice(3, 6)]
    : [QUICK_ACCESS.slice(0, 3), QUICK_ACCESS.slice(3, 6), STATS_ACCESS]

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isGuest ? 120 : 100 }}
      >
        <View className="flex-row items-center justify-between px-5 pt-14 pb-4">
          <Text className="font-bold text-2xl text-white">More</Text>
          {!isGuest && (
            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                onPress={() => router.push("/dashboard/search")}
                accessibilityLabel="Search"
              >
                <Ionicons name="search-outline" size={22} color="#ccc" />
              </TouchableOpacity>
              <View className="relative">
                <Ionicons name="wallet-outline" size={22} color="#ccc" />
                <View className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
              </View>
              <Ionicons name="diamond-outline" size={22} color="#ccc" />
            </View>
          )}
        </View>

        {isGuest ? (
          <GuestHeader />
        ) : (
          <TouchableOpacity
            onPress={() => navigateToSection("account")}
            className="mx-5 mb-4 flex-row items-center gap-3 rounded-2xl border border-[#2E2E2E] bg-muted p-4"
          >
            <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
              <Text className="font-bold text-lg text-white uppercase">
                {user?.display_name?.slice(0, 2) ?? "SB"}
              </Text>
            </View>
            <View className="min-w-0 flex-1">
              <View className="flex-row flex-wrap items-center gap-2">
                <Text className="font-bold text-base text-white capitalize">
                  {user?.display_name ?? "Sable User"}
                </Text>
                <View className="rounded-md border border-[#3a3a3a] px-1.5 py-0.5">
                  <Text className="font-medium text-[10px] text-foreground">
                    {USER.plan}
                  </Text>
                </View>
              </View>
              <Text className="mt-0.5 text-foreground text-sm lowercase">
                @{user?.display_name?.split(" ")[0]}
              </Text>
              <View className="mt-2 flex-row flex-wrap items-center gap-4">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons
                    name="wallet-outline"
                    size={14}
                    color={COLORS.primary}
                  />
                  <Text className="text-foreground text-xs">
                    {USER.coins} coins
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="flame-outline" size={14} color="#F97316" />
                  <Text className="text-foreground text-xs">
                    {USER.streak} day streak
                  </Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#444" />
          </TouchableOpacity>
        )}

        {!isGuest && (
          <TouchableOpacity
            onPress={() => navigateToSection("membership")}
            className="mx-5 mb-6 overflow-hidden rounded-2xl"
            style={{ borderWidth: 1, borderColor: PREMIUM_BORDER_COLOR }}
          >
            <LinearGradient
              colors={[...PREMIUM_GRADIENT_COLORS]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 16 }}
            >
              <View className="flex-row items-center gap-3">
                <View className="h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                  <Ionicons name="diamond-outline" size={22} color="#fff" />
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="font-bold text-base text-white">
                    Go Premium
                  </Text>
                  <Text className="text-sm text-white/75">
                    Ad-free · Offline · Unlimited episodes
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="font-semibold text-sm text-white">
                    From ₦2,500
                  </Text>
                  <Text className="text-white/70 text-xs">/mo</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <SectionLabel>QUICK ACTIONS</SectionLabel>
        <View className="mb-6 gap-3 px-5">
          {quickRows.map((row) => (
            <View
              key={row.map((item) => item.id).join("-")}
              className="flex-row gap-3"
            >
              {row.map((item) => (
                <QuickAccessCard key={item.id} item={item} disabled={isGuest} />
              ))}
            </View>
          ))}
        </View>

        {!isGuest && (
          <>
            <SectionLabel>ACCOUNT</SectionLabel>
            <View className="mx-5 mb-3 overflow-hidden rounded-2xl border border-[#2E2E2E] bg-muted">
              <AccountRow
                item={ACCOUNT_PRIMARY}
                onPress={() =>
                  navigateToSection(ACCOUNT_PRIMARY.route ?? "account")
                }
              />
            </View>
            <ItemGroup items={ACCOUNT_ITEMS} />
          </>
        )}

        <SectionLabel>SETTINGS</SectionLabel>
        <ItemGroup items={SETTINGS_ITEMS} />

        <SectionLabel>SUPPORT</SectionLabel>
        <ItemGroup items={SUPPORT_ITEMS} />

        {!isGuest && (
          <View className="mx-5 overflow-hidden rounded-2xl border border-[#2E2E2E] bg-muted">
            <AccountRow
              item={{
                id: "sign-out",
                title: "Sign Out",
                icon: "log-out-outline",
                destructive: true,
              }}
              onPress={handleSignOut}
            />
          </View>
        )}
      </ScrollView>

      {isGuest && (
        <View className="absolute right-0 bottom-0 left-0 bg-background px-5 pt-4 pb-8">
          <TouchableOpacity
            onPress={() => router.push("/auth/sign-in")}
            className="w-full flex-row items-center justify-center gap-2 rounded-2xl py-4"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Ionicons name="log-in-outline" size={18} color="#fff" />
            <Text className="font-semibold text-base text-white">
              Sign in to Sable TV
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
