import type { ComponentProps } from "react"
import type { Ionicons } from "@expo/vector-icons"

export type PlayerMenuIcon = ComponentProps<typeof Ionicons>["name"]

export type PlayerMenuOption = {
  label: string
  value: string
  disabled?: boolean
}

export type PlayerMenuItem = {
  id: "speed" | "audio" | "subtitles" | "quality"
  icon: PlayerMenuIcon
  label: string
  valueLabel: string
  disabled?: boolean
  helperText?: string
  options: PlayerMenuOption[]
}

export const PLAYBACK_SPEED_OPTIONS: PlayerMenuOption[] = [
  { label: "0.5x", value: "0.5" },
  { label: "0.75x", value: "0.75" },
  { label: "Normal", value: "1" },
  { label: "1.25x", value: "1.25" },
  { label: "1.5x", value: "1.5" },
  { label: "2x", value: "2" },
]

export const SEEK_STEP_SECONDS = 10
