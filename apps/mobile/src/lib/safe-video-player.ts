import type { VideoPlayer } from "expo-video"

const END_OF_PLAYBACK_TOLERANCE_SECONDS = 0.5

export function isAtEndOfPlayback(player: VideoPlayer) {
  return (
    player.duration > 0 &&
    player.currentTime >= player.duration - END_OF_PLAYBACK_TOLERANCE_SECONDS
  )
}

export function rewindPlaybackFromEnd(player: VideoPlayer) {
  if (!isAtEndOfPlayback(player)) return

  try {
    player.replay()
  } catch {
    try {
      player.currentTime = 0
    } catch {
      // Native player may already be released during navigation or unmount.
    }
  }
}

export function safePlay(player: VideoPlayer) {
  try {
    if (isAtEndOfPlayback(player)) {
      rewindPlaybackFromEnd(player)
    }
    player.play()
  } catch {
    // Native player may already be released during navigation or unmount.
  }
}

export function safePause(player: VideoPlayer) {
  try {
    player.pause()
  } catch {
    // Native player may already be released during navigation or unmount.
  }
}
