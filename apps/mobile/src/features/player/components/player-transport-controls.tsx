import { Ionicons } from "@expo/vector-icons"
import { Text, TouchableOpacity, View } from "react-native"
import { SEEK_STEP_SECONDS } from "../types/player-settings"

type PlayerTransportControlsProps = {
  isPlaying: boolean
  visible: boolean
  onPlay: () => void
  onPause: () => void
  onSeekBackward: () => void
  onSeekForward: () => void
}

export function PlayerTransportControls({
  isPlaying,
  visible,
  onPlay,
  onPause,
  onSeekBackward,
  onSeekForward,
}: PlayerTransportControlsProps) {
  if (!visible) return null

  return (
    <View
      className="absolute flex-row items-center justify-center gap-8"
      style={{
        top: "50%",
        left: "50%",
        transform: [{ translateX: -120 }, { translateY: -32 }],
        zIndex: 15,
        width: 240,
      }}
    >
      <TouchableOpacity
        onPress={onSeekBackward}
        accessibilityLabel={`Rewind ${SEEK_STEP_SECONDS} seconds`}
        className="h-12 w-12 items-center justify-center rounded-full bg-black/40"
      >
        <Ionicons name="play-back" size={22} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={isPlaying ? onPause : onPlay}
        accessibilityLabel={isPlaying ? "Pause" : "Play"}
      >
        <View className="h-16 w-16 items-center justify-center rounded-full bg-white/90">
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={28}
            color="#000"
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSeekForward}
        accessibilityLabel={`Forward ${SEEK_STEP_SECONDS} seconds`}
        className="h-12 w-12 items-center justify-center rounded-full bg-black/40"
      >
        <Ionicons name="play-forward" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}
