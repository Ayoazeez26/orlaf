export const ANALYTICS_DATE_RANGE_OPTIONS = [
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
] as const satisfies ReadonlyArray<import("./types").AnalyticsDateRangeLabel>

export const DEFAULT_ANALYTICS_DATE_RANGE =
  "Last 30 days" as import("./types").AnalyticsDateRangeLabel

/** Avoid full-width period selects on mobile; use on page headers and cards */
export const DATE_RANGE_SELECT_TRIGGER_CLASS =
  "w-fit min-w-[8.25rem] shrink-0 rounded-[10px] border-border bg-transparent px-3 py-2 dark:bg-transparent"

export const DATE_RANGE_SELECT_TRIGGER_HEADER_CLASS =
  "w-fit min-w-[8.25rem] shrink-0 rounded-[10px] border-border bg-transparent px-4 py-4 dark:bg-transparent"

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

/** Keeps Y-axis labels (e.g. 16k) from reserving excess space on narrow viewports */
export const ANALYTICS_CHART_Y_AXIS_WIDTH = 30

export const ANALYTICS_CHART_MARGIN = {
  top: 8,
  right: 4,
  left: 0,
  bottom: 4,
} as const

/** Matches frosted card background so donut segment gaps blend in light/dark mode */
export const ANALYTICS_DONUT_SEGMENT_STROKE = "var(--surface-frosted)"
