import { useEvent, useEventListener } from "expo"
import type {
  AudioTrack,
  SubtitleTrack,
  VideoPlayer,
  VideoTrack,
} from "expo-video"
import { useCallback, useMemo, useState } from "react"
import {
  PLAYBACK_SPEED_OPTIONS,
  type PlayerMenuItem,
} from "../types/player-settings"

function formatPlaybackSpeed(rate: number) {
  const match = PLAYBACK_SPEED_OPTIONS.find(
    (option) => Number(option.value) === rate
  )
  return match?.label ?? `${rate}x`
}

function formatVideoQuality(track: VideoTrack | null) {
  if (!track?.size?.height) return "Auto"
  return `${track.size.height}p`
}

function trackLabel(track: SubtitleTrack | AudioTrack) {
  return track.label || track.name || track.language.toUpperCase()
}

type UsePlayerSettingsOptions = {
  player: VideoPlayer
}

export function usePlayerSettings({ player }: UsePlayerSettingsOptions) {
  const { playbackRate } = useEvent(player, "playbackRateChange", {
    playbackRate: player.playbackRate,
  })

  const { subtitleTrack } = useEvent(player, "subtitleTrackChange", {
    subtitleTrack: player.subtitleTrack,
  })

  const { audioTrack } = useEvent(player, "audioTrackChange", {
    audioTrack: player.audioTrack,
  })

  const { videoTrack } = useEvent(player, "videoTrackChange", {
    videoTrack: player.videoTrack,
  })

  const [availableSubtitleTracks, setAvailableSubtitleTracks] = useState(
    player.availableSubtitleTracks
  )
  const [availableAudioTracks, setAvailableAudioTracks] = useState(
    player.availableAudioTracks
  )
  const [availableVideoTracks, setAvailableVideoTracks] = useState(
    player.availableVideoTracks
  )

  useEventListener(
    player,
    "availableSubtitleTracksChange",
    ({ availableSubtitleTracks: tracks }) => setAvailableSubtitleTracks(tracks)
  )

  useEventListener(
    player,
    "availableAudioTracksChange",
    ({ availableAudioTracks: tracks }) => setAvailableAudioTracks(tracks)
  )

  useEventListener(player, "sourceLoad", () => {
    setAvailableSubtitleTracks(player.availableSubtitleTracks)
    setAvailableAudioTracks(player.availableAudioTracks)
    setAvailableVideoTracks(player.availableVideoTracks)
  })

  const setPlaybackSpeed = useCallback(
    (rate: number) => {
      player.preservesPitch = true
      player.playbackRate = rate
    },
    [player]
  )

  const setSubtitleByKey = useCallback(
    (key: string) => {
      if (key === "off") {
        player.subtitleTrack = null
        return
      }

      const track = availableSubtitleTracks.find(
        (candidate) => subtitleKey(candidate) === key
      )
      player.subtitleTrack = track ?? null
    },
    [availableSubtitleTracks, player]
  )

  const setAudioTrackByKey = useCallback(
    (key: string) => {
      const track = availableAudioTracks.find(
        (candidate) => audioKey(candidate) === key
      )
      player.audioTrack = track ?? null
    },
    [availableAudioTracks, player]
  )

  const seekForward = useCallback(
    (seconds = 10) => {
      player.seekBy(seconds)
    },
    [player]
  )

  const seekBackward = useCallback(
    (seconds = 10) => {
      player.seekBy(-seconds)
    },
    [player]
  )

  const seekTo = useCallback(
    (seconds: number) => {
      const max = player.duration > 0 ? player.duration : seconds
      player.currentTime = Math.max(0, Math.min(seconds, max))
    },
    [player]
  )

  const menuItems = useMemo<PlayerMenuItem[]>(() => {
    const subtitleOptions = [
      { label: "Off", value: "off" },
      ...availableSubtitleTracks.map((track) => ({
        label: trackLabel(track),
        value: subtitleKey(track),
      })),
    ]

    const audioOptions = availableAudioTracks.map((track) => ({
      label: trackLabel(track),
      value: audioKey(track),
    }))

    const qualityOptions =
      availableVideoTracks.length > 0
        ? [
            { label: "Auto", value: "auto" },
            ...availableVideoTracks.map((track) => ({
              label: formatVideoQuality(track),
              value: track.id,
              disabled: true,
            })),
          ]
        : [{ label: "Auto", value: "auto" }]

    return [
      {
        id: "speed",
        icon: "speedometer-outline",
        label: "Playback Speed",
        valueLabel: formatPlaybackSpeed(playbackRate),
        options: PLAYBACK_SPEED_OPTIONS,
      },
      {
        id: "audio",
        icon: "language-outline",
        label: "Audio Track",
        valueLabel: audioTrack ? trackLabel(audioTrack) : "Default",
        disabled: audioOptions.length <= 1,
        helperText:
          audioOptions.length <= 1
            ? "No alternate audio tracks in this stream yet"
            : undefined,
        options: audioOptions.length > 0 ? audioOptions : [],
      },
      {
        id: "subtitles",
        icon: "text-outline",
        label: "Subtitles",
        valueLabel: subtitleTrack ? trackLabel(subtitleTrack) : "Off",
        disabled: subtitleOptions.length <= 1,
        helperText:
          subtitleOptions.length <= 1
            ? "No embedded subtitle tracks in this stream yet"
            : undefined,
        options: subtitleOptions,
      },
      {
        id: "quality",
        icon: "film-outline",
        label: "Quality",
        valueLabel: formatVideoQuality(videoTrack),
        disabled: true,
        helperText:
          "HLS quality is adaptive for now — manual track selection is not exposed by expo-video yet",
        options: qualityOptions,
      },
    ]
  }, [
    audioTrack,
    availableAudioTracks,
    availableSubtitleTracks,
    availableVideoTracks,
    playbackRate,
    subtitleTrack,
    videoTrack,
  ])

  const handleMenuSelect = useCallback(
    (itemId: PlayerMenuItem["id"], value: string) => {
      switch (itemId) {
        case "speed":
          setPlaybackSpeed(Number(value))
          break
        case "audio":
          setAudioTrackByKey(value)
          break
        case "subtitles":
          setSubtitleByKey(value)
          break
        case "quality":
          break
      }
    },
    [setAudioTrackByKey, setPlaybackSpeed, setSubtitleByKey]
  )

  const getSelectedValue = useCallback(
    (itemId: PlayerMenuItem["id"]) => {
      switch (itemId) {
        case "speed":
          return (
            PLAYBACK_SPEED_OPTIONS.find(
              (option) => Number(option.value) === playbackRate
            )?.value ?? "1"
          )
        case "audio":
          return audioTrack ? audioKey(audioTrack) : ""
        case "subtitles":
          return subtitleTrack ? subtitleKey(subtitleTrack) : "off"
        case "quality":
          return "auto"
        default:
          return ""
      }
    },
    [audioTrack, playbackRate, subtitleTrack]
  )

  return {
    playbackRate,
    menuItems,
    handleMenuSelect,
    getSelectedValue,
    seekForward,
    seekBackward,
    seekTo,
    setPlaybackSpeed,
  }
}

function subtitleKey(track: SubtitleTrack) {
  return track.id ?? `${track.language}:${track.label}`
}

function audioKey(track: AudioTrack) {
  return track.id ?? `${track.language}:${track.label}`
}
