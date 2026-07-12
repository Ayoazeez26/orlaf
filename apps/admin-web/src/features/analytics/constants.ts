/** Series colors used across the analytics charts. */
export const ANALYTICS_SERIES_COLORS = {
  primary: "var(--primary)",
  green: "var(--trend-positive)",
  amber: "#f59e0b",
} as const

export const ANALYTICS_CHART_AXIS_LINE = { stroke: "var(--border)" }

export const ANALYTICS_CHART_TICK = {
  fontSize: 12,
  fill: "var(--muted-foreground)",
} as const

export const ANALYTICS_CHART_Y_AXIS_WIDTH = 44

export const ANALYTICS_CHART_MARGIN = {
  top: 8,
  right: 8,
  left: 0,
  bottom: 4,
} as const

export const ANALYTICS_TOOLTIP_CONTENT_STYLE = {
  borderRadius: "8px",
  border: "1px solid var(--border)",
  background: "var(--card)",
} as const
