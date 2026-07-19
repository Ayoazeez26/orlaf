import { Ionicons } from "@expo/vector-icons"
import { useEvent, useEventListener } from "expo"
import { router, useFocusEffect } from "expo-router"
import { useVideoPlayer, VideoView } from "expo-video"
import { useCallback, useEffect, useRef, useState } from "react"
import type { ImageSourcePropType } from "react-native"
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import PagerView from "react-native-pager-view"
import { PlayerControls } from "../../components/player-controls"
import { usePlayerSettings } from "../../features/player/hooks/use-player-settings"
import { safePause, safePlay } from "../../lib/safe-video-player"
import { fetchCatalogFeed } from "../../services/catalog-api"

const { height } = Dimensions.get("window")

const DEMO_FEED: FeedItemData[] = [
  {
    id: "1",
    title: "Lagos Glamour",
    tags: ["AfriStream", "Comedy"],
    desc: "Three best friends navigate city life in Lagos...",
    image: require("../../../assets/images/movie-1.png"),
    videoUrl:
      "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
  },
  {
    id: "2",
    title: "Golden Coast",
    tags: ["AfriStream", "Drama"],
    desc: "A sweeping romance set on the Gold Coast...",
    image: require("../../../assets/images/movie-1.png"),
    videoUrl:
      "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
  },
  {
    id: "3",
    title: "Savanna Rising",
    tags: ["AfriStream", "Sci-Fi"],
    desc: "An epic journey across a future Africa...",
    image: require("../../../assets/images/movie-1.png"),
    videoUrl:
      "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
  },
]

type FeedItemData = {
  id: string
  title: string
  tags: string[]
  desc: string
  image: ImageSourcePropType
  videoUrl: string
}

function FeedItem({
  item,
  isActive,
  player,
  thumbnailVisible,
  showControls,
  error,
  isPlaying,
  isLoading,
  onScreenTap,
  onRetry,
  onFirstFrame,
}: {
  item: FeedItemData
  isActive: boolean
  player: ReturnType<typeof useVideoPlayer>
  thumbnailVisible: boolean
  showControls: boolean
  error: string | null
  isPlaying: boolean
  isLoading: boolean
  onScreenTap: () => void
  onRetry: () => void
  onFirstFrame: () => void
}) {
  const playerSettings = usePlayerSettings({ player })

  return (
    <View style={{ height }} className="bg-black">
      {isActive && (
        <VideoView
          surfaceType="textureView"
          player={player}
          style={{ position: "absolute", width: "100%", height: "100%" }}
          contentFit="cover"
          nativeControls={false}
          onFirstFrameRender={onFirstFrame}
        />
      )}

      {thumbnailVisible && !error && (
        <Image
          source={item.image}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
          resizeMode="cover"
        />
      )}

      <Image
        source={require("../../../assets/images/overlay-img/Gradient.png")}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
        }}
        resizeMode="stretch"
      />

      <View className="absolute inset-0 bg-black/20" style={{ zIndex: 2 }} />

      {isActive && isLoading && (
        <View
          className="absolute inset-0 items-center justify-center bg-black/60"
          style={{ zIndex: 20 }}
        >
          <ActivityIndicator size="small" color="#fff" />
        </View>
      )}

      {isActive && error && (
        <View
          className="absolute inset-0 items-center justify-center bg-black/80"
          style={{ zIndex: 20 }}
        >
          <Ionicons name="wifi-outline" size={44} color="#555" />
          <Text className="mt-3 font-semibold text-base text-white">
            Unable to play video
          </Text>
          <Text className="mt-1 px-10 text-center text-sm text-white/50">
            Check your connection and try again.
          </Text>
          <TouchableOpacity
            onPress={onRetry}
            className="mt-5 rounded-xl bg-purple-600 px-8 py-3"
          >
            <Text className="font-semibold text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {isActive && !error && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={onScreenTap}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 200,
            zIndex: 5,
          }}
        />
      )}

      {isActive && !error && (
        <PlayerControls
          menuItems={playerSettings.menuItems}
          getSelectedValue={playerSettings.getSelectedValue}
          onMenuSelect={playerSettings.handleMenuSelect}
        />
      )}

      {isActive && !error && (!isPlaying || showControls) && (
        <TouchableOpacity
          onPress={onScreenTap}
          style={{
            position: "absolute",
            top: "45%",
            left: "50%",
            marginLeft: -32,
            marginTop: -32,
            zIndex: 15,
          }}
        >
          <View className="h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/50">
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={28}
              color="#fff"
            />
          </View>
        </TouchableOpacity>
      )}

      {!error && (
        <View
          className="absolute right-0 bottom-0 left-0"
          style={{ zIndex: 10 }}
        >
          <Image
            source={require("../../../assets/images/overlay-img/Gradient.png")}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              width: "100%",
              height: 300,
            }}
            resizeMode="stretch"
          />
          <View className="px-4 pt-4 pb-24">
            <View className="flex-row items-center gap-3 rounded-2xl bg-white/5 p-3">
              <TouchableOpacity
                onPress={() => router.push(`/dashboard/series/${item.id}`)}
                activeOpacity={0.85}
                className="min-w-0 flex-1 flex-row items-center gap-3"
              >
                <Image
                  source={item.image}
                  style={{ width: 64, height: 80, borderRadius: 10 }}
                  resizeMode="cover"
                />
                <View className="min-w-0 flex-1">
                  <Text className="mb-1 font-bold text-base text-white">
                    {item.title}
                  </Text>
                  <View className="mb-1 flex-row flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <View
                        key={t}
                        className="rounded-full bg-white/10 px-2 py-0.5"
                      >
                        <Text className="text-gray-300 text-xs">{t}</Text>
                      </View>
                    ))}
                  </View>
                  <Text className="text-gray-400 text-xs" numberOfLines={2}>
                    {item.desc}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push(`/dashboard/movie/player/${item.id}`)
                }
                className="flex-row items-center gap-2 rounded-2xl bg-white px-4 py-2.5"
              >
                <Ionicons name="play" size={12} color="#000" />
                <Text className="font-bold text-black text-sm">Watch</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default function ForYou() {
  const [feed, setFeed] = useState<FeedItemData[]>(DEMO_FEED)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isScreenFocused, setIsScreenFocused] = useState(true)
  const [thumbnailVisible, setThumbnailVisible] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const userPausedRef = useRef(false)
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeItem = feed[activeIndex] ?? feed[0]

  const player = useVideoPlayer(
    activeItem?.videoUrl ?? DEMO_FEED[0].videoUrl,
    (p) => {
      p.loop = true
    }
  )

  useEffect(() => {
    let cancelled = false

    fetchCatalogFeed()
      .then((items) => {
        if (cancelled || items.length === 0) return

        setFeed(
          items.map((item) => ({
            id: item.id,
            title: item.title,
            tags: [item.seriesTitle, item.accessType],
            desc: item.synopsis ?? "",
            image: item.thumbnailUrl
              ? { uri: item.thumbnailUrl }
              : require("../../../assets/images/movie-1.png"),
            videoUrl: item.hlsUrl,
          }))
        )
      })
      .catch(() => {
        // Keep demo feed when catalog is unavailable
      })

    return () => {
      cancelled = true
    }
  }, [])

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  })

  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  })

  const isLoading = status === "loading" && !thumbnailVisible && !error

  useEventListener(
    player,
    "statusChange",
    ({ status: s, error: playerError }) => {
      if (playerError) setError(playerError.message)
      if (s === "readyToPlay") setError(null)
    }
  )

  useEffect(() => {
    if (isPlaying) setThumbnailVisible(false)
  }, [isPlaying])

  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true)
      if (!userPausedRef.current) safePlay(player)
      return () => {
        setIsScreenFocused(false)
        safePause(player)
      }
    }, [player])
  )

  useEffect(() => {
    const item = feed[activeIndex]
    if (!item) return
    userPausedRef.current = false
    setThumbnailVisible(true)
    setShowControls(false)
    setError(null)
    if (hideTimeout.current) clearTimeout(hideTimeout.current)

    void player.replaceAsync(item.videoUrl).then(() => {
      if (!userPausedRef.current) safePlay(player)
    })
  }, [activeIndex, feed, player])

  useEffect(() => {
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current)
    }
  }, [])

  const handleRetry = useCallback(() => {
    if (!activeItem) return
    setError(null)
    setThumbnailVisible(true)
    void player.replaceAsync(activeItem.videoUrl).then(() => {
      if (isScreenFocused) safePlay(player)
    })
  }, [activeItem, isScreenFocused, player])

  const handleScreenTap = useCallback(() => {
    if (!isScreenFocused) return
    if (hideTimeout.current) clearTimeout(hideTimeout.current)
    if (isPlaying) {
      userPausedRef.current = true
      safePause(player)
      setShowControls(true)
    } else {
      userPausedRef.current = false
      safePlay(player)
      setThumbnailVisible(false)
      setShowControls(true)
      hideTimeout.current = setTimeout(() => setShowControls(false), 3000)
    }
  }, [isPlaying, isScreenFocused, player])

  return (
    <View className="flex-1 bg-black">
      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        orientation="vertical"
        onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)}
      >
        {feed.map((item, i) => (
          <View key={item.id} style={{ flex: 1 }}>
            <FeedItem
              item={item}
              isActive={i === activeIndex}
              player={player}
              thumbnailVisible={thumbnailVisible}
              showControls={showControls}
              error={error}
              isPlaying={isPlaying}
              isLoading={isLoading}
              onScreenTap={handleScreenTap}
              onRetry={handleRetry}
              onFirstFrame={() => setThumbnailVisible(false)}
            />
          </View>
        ))}
      </PagerView>
    </View>
  )
}
