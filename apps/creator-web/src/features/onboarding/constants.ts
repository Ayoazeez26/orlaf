import { Clapperboard, Film, Mic, MonitorPlay, Sparkles } from "lucide-react"
import type { ContentFormatOption } from "./types"

export const CONTENT_FORMATS: ContentFormatOption[] = [
  { id: "short-drama", label: "Short Drama", icon: Clapperboard },
  { id: "web-series", label: "Web Series", icon: MonitorPlay },
  { id: "micro-content", label: "Micro Content", icon: Mic },
  { id: "documentary", label: "Documentary", icon: Film },
  { id: "ai-films", label: "AI Films", icon: Sparkles },
]

export const TEAM_SIZE_OPTIONS = [
  { value: "1-5" as const, label: "1-5" },
  { value: "6-15" as const, label: "6-15" },
  { value: "16-50" as const, label: "16-50" },
  { value: "50+" as const, label: "50+" },
]

export const ONBOARDING_STORAGE_KEY = "orlaf-onboarding-data"

export const STUDIO_TOOLS = [
  { label: "Auto-edit & fine-tune episodes", icon: "scissors" },
  { label: "Generate Magic Clips", icon: "wand" },
  { label: "Export & publish to your audience", icon: "file" },
] as const
