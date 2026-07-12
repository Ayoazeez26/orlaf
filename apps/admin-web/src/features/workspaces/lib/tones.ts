import type { Tone } from "../types"

/** Icon chip background + foreground per tone. */
export const TONE_CHIP_CLASS: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  positive: "bg-emerald-500/10 text-emerald-600",
  warning: "bg-amber-500/10 text-amber-600",
  danger: "bg-red-500/10 text-red-600",
  info: "bg-indigo-500/10 text-indigo-600",
}

/** Progress bar fill color per tone. */
export const TONE_FILL_CLASS: Record<Tone, string> = {
  primary: "bg-primary",
  positive: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-indigo-500",
}
