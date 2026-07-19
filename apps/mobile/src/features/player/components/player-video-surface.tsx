import { Ionicons } from "@expo/vector-icons"
import type { VideoPlayer } from "expo-video"
import { VideoView } from "expo-video"
import {
  ActivityIndicator,
  Image,
  type ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { DEFAULT_POSTER, GRADIENT_OVERLAY } from "../constants"

type PlayerVideoSurfaceProps = {
  player: VideoPlayer
  posterSource?: ImageSourcePropType
  thumbnailVisible: boolean
  isBuffering: boolean
  isSwitchingSource: boolean
  error: string | null
  onFirstFrame: () => void
  onRetry: () => void
  onBack: () => void
}

export function PlayerVideoSurface({
  player,
  posterSource = DEFAULT_POSTER,
  thumbnailVisible,
  isBuffering,
  isSwitchingSource,
  error,
  onFirstFrame,
  onRetry,
  onBack,
}: PlayerVideoSurfaceProps) {
  return (
    <>
      <VideoView
        surfaceType="textureView"
        player={player}
        style={{ position: "absolute", width: "100%", height: "100%" }}
        contentFit="cover"
        nativeControls={false}
        allowsPictureInPicture
        onFirstFrameRender={onFirstFrame}
      />

      {thumbnailVisible && !error && (
        <>
          <Image
            source={posterSource}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 1,
            }}
            resizeMode="cover"
          />
          <Image
            source={GRADIENT_OVERLAY}
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
          <View
            className="absolute inset-0 bg-black/20"
            style={{ zIndex: 3 }}
          />
        </>
      )}

      {isBuffering && (
        <View
          className="absolute inset-0 items-center justify-center bg-black/60"
          style={{ zIndex: 20 }}
        >
          <ActivityIndicator size="small" color="#fff" />
          {isSwitchingSource && (
            <Text className="mt-2 text-white/50 text-xs">Loading...</Text>
          )}
        </View>
      )}

      {error && (
        <View
          className="absolute inset-0 items-center justify-center bg-black/90"
          style={{ zIndex: 20 }}
        >
          <Ionicons name="wifi-outline" size={48} color="#555" />
          <Text className="mt-4 font-semibold text-base text-white">
            Unable to play video
          </Text>
          <Text className="mt-2 px-10 text-center text-sm text-white/50">
            Check your internet connection and try again.
          </Text>
          <TouchableOpacity
            onPress={onRetry}
            className="mt-6 rounded-xl bg-purple-600 px-8 py-3"
          >
            <Text className="font-semibold text-white">Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onBack} className="mt-3 px-8 py-3">
            <Text className="text-white/50">Go Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  )
}
