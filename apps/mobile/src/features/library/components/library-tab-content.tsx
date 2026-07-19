import { Ionicons } from "@expo/vector-icons"
import type { WatchlistSeriesItem } from "@sable/contracts"
import { router } from "expo-router"
import { Crown } from "lucide-react-native"
import type { ReactNode } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  type ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { COLORS } from "../../../constants/theme"
import { useAuth } from "../../../context/auth-context"
import {
  useClearWatchlist,
  useRemoveFromWatchlist,
  useWatchlist,
} from "../../../hooks/use-watchlist"
import { VerifiedBadge } from "../../creator/components/verified-badge"
import {
  DOWNLOAD_ITEMS,
  type DownloadItem,
  HISTORY_ITEMS,
  type HistoryItem,
  LIBRARY_CREATORS,
  type LibraryCreatorItem,
} from "../data"

const FALLBACK_POSTER = require("../../../../assets/images/palm-wine-movie.png")

function ListMenuButton() {
  return (
    <TouchableOpacity
      accessibilityLabel="More options"
      className="h-8 w-8 items-center justify-center"
    >
      <Ionicons name="ellipsis-vertical" size={18} color="#666" />
    </TouchableOpacity>
  )
}

function LibraryListHeader({
  count,
  onClearAll,
}: {
  count: number
  onClearAll: () => void
}) {
  return (
    <View className="mb-2 flex-row items-center justify-between px-5 py-3">
      <Text className="text-[#8C8E9C] text-xs">
        {count} item{count === 1 ? "" : "s"}
      </Text>
      <TouchableOpacity onPress={onClearAll}>
        <Text className="font-medium text-[#F8F8F8] text-xs">Clear all</Text>
      </TouchableOpacity>
    </View>
  )
}

function PosterThumb({ source }: { source: ImageSourcePropType }) {
  return (
    <View className="h-[72px] w-16 shrink-0 overflow-hidden rounded-xl">
      <Image
        source={source}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </View>
  )
}

function RemotePosterThumb({ posterUrl }: { posterUrl: string | null }) {
  const source = posterUrl ? { uri: posterUrl } : FALLBACK_POSTER
  return <PosterThumb source={source} />
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <View className="mt-2 flex-row items-center gap-2">
      <View className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
        <View
          className="h-1 rounded-full"
          style={{
            width: `${progress}%`,
            backgroundColor: "#8C8E9CB2",
          }}
        />
      </View>
      <Text className="text-[#8C8E9C] text-[10px]">{progress}%</Text>
    </View>
  )
}

function WatchlistRow({
  item,
  onRemove,
}: {
  item: WatchlistSeriesItem
  onRemove: (seriesId: string) => void
}) {
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/dashboard/movie/player/[id]",
          params: {
            id: item.seriesId,
            returnTo: "/dashboard/library",
          },
        })
      }
      className="flex-row items-center gap-3 border-white/5 border-b px-5 py-4"
    >
      <RemotePosterThumb posterUrl={item.posterUrl} />
      <View className="min-w-0 flex-1">
        <Text className="mb-0.5 font-semibold text-base text-white">
          {item.title}
        </Text>
        <Text className="text-[#8C8E9C] text-sm">{item.subtitle}</Text>
      </View>
      <TouchableOpacity
        accessibilityLabel="Remove from watchlist"
        className="h-8 w-8 items-center justify-center"
        onPress={() => onRemove(item.seriesId)}
      >
        <Ionicons name="ellipsis-vertical" size={18} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

function HistoryRow({ item }: { item: HistoryItem }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/dashboard/movie/player/${item.id}`)}
      className="border-white/5 border-b px-5 py-4"
    >
      <View className="flex-row items-center gap-3">
        <PosterThumb source={item.image} />
        <View className="min-w-0 flex-1">
          <Text className="mb-0.5 font-semibold text-base text-white">
            {item.title}
          </Text>
          <Text className="text-[#8C8E9C] text-sm">{item.subtitle}</Text>
          {item.completed ? (
            <View className="mt-2 self-start rounded-full bg-primary/20 px-2.5 py-0.5">
              <Text className="font-medium text-[10px] text-primary">
                Completed
              </Text>
            </View>
          ) : item.progress !== undefined ? (
            <ProgressBar progress={item.progress} />
          ) : null}
        </View>
        <ListMenuButton />
      </View>
    </TouchableOpacity>
  )
}

function PremiumBanner() {
  return (
    <View className="mx-5 my-4 flex-row items-center gap-3 rounded-3xl border border-white/10 bg-[#10111A] p-3">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/20">
        <Crown size={20} color={COLORS.primary} strokeWidth={2} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="mb-0.5 font-semibold text-sm text-white">
          Join Premium Membership
        </Text>
        <Text className="text-[#8C8E9C] text-xs">
          Unlimited Downloads · Ad-free viewing
        </Text>
      </View>
      <TouchableOpacity className="rounded-full bg-primary px-3 py-2">
        <Text className="font-semibold text-white text-xs">Upgrade</Text>
      </TouchableOpacity>
    </View>
  )
}

function DownloadSubtitle({
  episodeLabel,
  quality,
}: {
  episodeLabel: string
  quality: string
}) {
  return (
    <Text className="text-sm">
      <Text className="text-[#8C8E9C]">{episodeLabel}</Text>
      <Text className="text-[#8C8E9C]"> · </Text>
      <Text style={{ color: COLORS.primary }}>{quality}</Text>
    </Text>
  )
}

function DownloadRow({ item }: { item: DownloadItem }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/dashboard/movie/player/${item.id}`)}
      className="border-white/5 border-b px-5 py-4"
    >
      <View className="flex-row items-center gap-3">
        <PosterThumb source={item.image} />
        <View className="min-w-0 flex-1">
          <Text className="mb-0.5 font-semibold text-base text-white">
            {item.title}
          </Text>
          <DownloadSubtitle
            episodeLabel={item.episodeLabel}
            quality={item.quality}
          />
          {item.completed ? (
            <View className="mt-2 flex-row items-center gap-1.5">
              <Ionicons
                name="checkmark-circle-outline"
                size={14}
                color={COLORS.primary}
              />
              <Text className="text-[#8C8E9C] text-xs">{item.fileSize}</Text>
            </View>
          ) : item.progress !== undefined ? (
            <ProgressBar progress={item.progress} />
          ) : null}
        </View>
        <ListMenuButton />
      </View>
    </TouchableOpacity>
  )
}

function CreatorRow({ item }: { item: LibraryCreatorItem }) {
  return (
    <View className="border-white/5 border-b px-5 py-4">
      <View className="flex-row items-center gap-3">
        <TouchableOpacity
          onPress={() => router.push(`/dashboard/creator/${item.creatorId}`)}
          className="min-w-0 flex-1 flex-row items-center gap-3"
        >
          <View className="relative">
            <View
              className="h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Text className="font-bold text-sm text-white">
                {item.initials}
              </Text>
            </View>
            {item.verified ? (
              <View className="absolute -right-0.5 -bottom-0.5">
                <VerifiedBadge size={16} />
              </View>
            ) : null}
          </View>
          <View className="min-w-0 flex-1">
            <Text className="mb-0.5 font-semibold text-base text-white">
              {item.name}
            </Text>
            <Text className="text-[#8C8E9C] text-sm">{item.stats}</Text>
          </View>
        </TouchableOpacity>
        <ListMenuButton />
      </View>

      <View className="mt-3 flex-row gap-2 pl-[60px]">
        {item.previews.map((preview) => {
          const previewKey = Image.resolveAssetSource(preview).uri

          return (
            <TouchableOpacity
              key={`${item.id}-${previewKey}`}
              onPress={() =>
                router.push(`/dashboard/movie/player/${item.creatorId}`)
              }
              className="h-16 w-11 overflow-hidden rounded-lg"
            >
              <Image
                source={preview}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

type TabListProps = {
  count: number
  onClearAll: () => void
  children: ReactNode
  header?: ReactNode
}

function TabList({ count, onClearAll, children, header }: TabListProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {header}
      <LibraryListHeader count={count} onClearAll={onClearAll} />
      {children}
    </ScrollView>
  )
}

export function WatchlistTabContent() {
  const { isAuthenticated } = useAuth()
  const { data, isLoading, isError, refetch } = useWatchlist()
  const clearWatchlist = useClearWatchlist()
  const removeFromWatchlist = useRemoveFromWatchlist()

  const handleClearAll = () => {
    if (!data?.items.length) return

    Alert.alert(
      "Clear watchlist",
      "Remove all saved series from your watchlist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear all",
          style: "destructive",
          onPress: () => clearWatchlist.mutate(),
        },
      ]
    )
  }

  const handleRemove = (seriesId: string) => {
    Alert.alert(
      "Remove from watchlist",
      "Remove this series from your watchlist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFromWatchlist.mutate(seriesId),
        },
      ]
    )
  }

  if (!isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center px-8">
        <Text className="mb-2 text-center font-semibold text-lg text-white">
          Sign in to save series
        </Text>
        <Text className="mb-6 text-center text-[#8C8E9C] text-sm">
          Your watchlist syncs across devices when you are signed in.
        </Text>
        <TouchableOpacity
          className="rounded-full bg-primary px-6 py-3"
          onPress={() => router.push("/auth/sign-in")}
        >
          <Text className="font-semibold text-white">Sign in</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color="#fff" />
      </View>
    )
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center px-8">
        <Text className="mb-4 text-center text-[#8C8E9C] text-sm">
          Could not load your watchlist.
        </Text>
        <TouchableOpacity
          className="rounded-full bg-white/10 px-5 py-2.5"
          onPress={() => refetch()}
        >
          <Text className="font-medium text-white">Try again</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const items = data?.items ?? []

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-8">
        <Text className="mb-2 text-center font-semibold text-lg text-white">
          Nothing saved yet
        </Text>
        <Text className="text-center text-[#8C8E9C] text-sm">
          Tap Save while watching a series to add it here.
        </Text>
      </View>
    )
  }

  return (
    <TabList count={items.length} onClearAll={handleClearAll}>
      {items.map((item) => (
        <WatchlistRow key={item.seriesId} item={item} onRemove={handleRemove} />
      ))}
    </TabList>
  )
}

export function HistoryTabContent() {
  return (
    <TabList count={HISTORY_ITEMS.length} onClearAll={() => {}}>
      {HISTORY_ITEMS.map((item) => (
        <HistoryRow key={item.id} item={item} />
      ))}
    </TabList>
  )
}

export function DownloadsTabContent() {
  return (
    <TabList
      count={DOWNLOAD_ITEMS.length}
      onClearAll={() => {}}
      header={<PremiumBanner />}
    >
      {DOWNLOAD_ITEMS.map((item) => (
        <DownloadRow key={item.id} item={item} />
      ))}
    </TabList>
  )
}

export function CreatorsTabContent() {
  return (
    <TabList count={LIBRARY_CREATORS.length} onClearAll={() => {}}>
      {LIBRARY_CREATORS.map((item) => (
        <CreatorRow key={item.id} item={item} />
      ))}
    </TabList>
  )
}
