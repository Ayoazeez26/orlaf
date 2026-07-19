import { useMemo, useRef, useState } from "react"
import { PanResponder, Text, View } from "react-native"
import { formatPlaybackTime } from "../utils/format-time"

type PlayerProgressBarProps = {
  currentTime: number
  duration: number
  onSeek: (timeSeconds: number) => void
  onScrubStart?: () => void
  onScrubEnd?: () => void
}

export function PlayerProgressBar({
  currentTime,
  duration,
  onSeek,
  onScrubStart,
  onScrubEnd,
}: PlayerProgressBarProps) {
  const trackWidthRef = useRef(0)
  const grantXRef = useRef(0)
  const scrubTimeRef = useRef(0)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [scrubTime, setScrubTime] = useState(0)

  const displayTime = isScrubbing ? scrubTime : currentTime
  const progressPercent =
    duration > 0 ? Math.min((displayTime / duration) * 100, 100) : 0

  const seekFromX = (x: number) => {
    const width = trackWidthRef.current
    if (width <= 0 || duration <= 0) return
    const ratio = Math.max(0, Math.min(x / width, 1))
    const nextTime = ratio * duration
    scrubTimeRef.current = nextTime
    setScrubTime(nextTime)
  }

  const panHandlers = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => duration > 0,
        onMoveShouldSetPanResponder: () => duration > 0,
        onPanResponderGrant: (event) => {
          onScrubStart?.()
          setIsScrubbing(true)
          grantXRef.current = event.nativeEvent.locationX
          seekFromX(grantXRef.current)
        },
        onPanResponderMove: (_event, gestureState) => {
          seekFromX(grantXRef.current + gestureState.dx)
        },
        onPanResponderRelease: () => {
          onSeek(scrubTimeRef.current)
          setIsScrubbing(false)
          onScrubEnd?.()
        },
        onPanResponderTerminate: () => {
          setIsScrubbing(false)
          onScrubEnd?.()
        },
      }).panHandlers,
    [duration, onScrubEnd, onScrubStart, onSeek]
  )

  return (
    <View className="my-5">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-white/50 text-xs">
          {formatPlaybackTime(displayTime)}
        </Text>
        <Text className="text-white/50 text-xs">
          {formatPlaybackTime(duration)}
        </Text>
      </View>

      <View
        onLayout={(event) => {
          trackWidthRef.current = event.nativeEvent.layout.width
        }}
        className="justify-center py-3"
        {...panHandlers}
      >
        <View className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <View
            className="h-1.5 rounded-full bg-white"
            style={{ width: `${progressPercent}%` }}
          />
        </View>

        {duration > 0 && (
          <View
            pointerEvents="none"
            className="absolute h-3.5 w-3.5 rounded-full bg-white"
            style={{
              left: `${progressPercent}%`,
              marginLeft: -7,
              opacity: isScrubbing ? 1 : 0.85,
              transform: [{ scale: isScrubbing ? 1.15 : 1 }],
            }}
          />
        )}
      </View>
    </View>
  )
}
