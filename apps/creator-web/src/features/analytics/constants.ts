export const ANALYTICS_DATE_RANGE_OPTIONS = [
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
] as const

export const DEFAULT_ANALYTICS_DATE_RANGE = "Last 30 days"

/** Mobile #7C51C8 · Desktop #C285E0 · Tablet #E0B8E0 (see globals.css) */
export const DEVICE_CHART_COLORS = {
  mobile: "var(--chart-device-mobile)",
  desktop: "var(--chart-device-desktop)",
  tablet: "var(--chart-device-tablet)",
} as const

export const ANALYTICS_CHART_AXIS_LINE = { stroke: "var(--border)" }
export const ANALYTICS_CHART_TICK = {
  fontSize: 12,
  fill: "var(--muted-foreground)",
} as const

/** Matches frosted card background so donut segment gaps blend in light/dark mode */
export const ANALYTICS_DONUT_SEGMENT_STROKE = "var(--surface-frosted)"
