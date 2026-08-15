import type { AdminAnalyticsSummary } from "@sable/contracts"
import { formatCompactCount } from "@/features/analytics/lib/map-admin-analytics"
import type { ProgressRow, StatRow, WorkspaceConfig } from "../types"

function overlayCount(
  label: string,
  value: string,
  counts: Record<string, number>
): string {
  const count = counts[label]
  return count == null ? value : formatCompactCount(count)
}

function overlayProgressRow(
  row: ProgressRow,
  counts: Record<string, number>
): ProgressRow {
  const count = counts[row.label]
  if (count == null) return row
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0)
  return {
    ...row,
    value: formatCompactCount(count),
    percent: total === 0 ? 0 : Math.round((count / total) * 100),
  }
}

function overlayStatRow(row: StatRow, counts: Record<string, number>): StatRow {
  return {
    ...row,
    value: overlayCount(row.label, row.value, counts),
  }
}

export function applyAnalyticsSummary(
  config: WorkspaceConfig,
  summary: AdminAnalyticsSummary
): WorkspaceConfig {
  const statusCounts: Record<string, number> = {
    Published: summary.published_series,
    "Pending Review": summary.pending_review_series,
    Flagged: summary.flagged_series,
  }

  const metricValues: Record<string, string> = {
    "Total Users": formatCompactCount(summary.total_users),
    "Active Creators": formatCompactCount(summary.total_creators),
    "Total Content": formatCompactCount(summary.published_series),
    "Platform Views": formatCompactCount(summary.views_30d),
    "Projects Live": formatCompactCount(summary.published_series),
    "Pending Review": formatCompactCount(summary.pending_review_series),
  }

  return {
    ...config,
    home: {
      ...config.home,
      metrics: config.home.metrics.map((metric) => ({
        ...metric,
        value: metricValues[metric.label] ?? metric.value,
      })),
      side: config.home.side.map((card) => {
        if (card.kind === "stats") {
          return {
            ...card,
            rows: card.rows.map((row) => overlayStatRow(row, statusCounts)),
          }
        }
        if (card.kind === "progress") {
          return {
            ...card,
            rows: card.rows.map((row) => overlayProgressRow(row, statusCounts)),
          }
        }
        return {
          ...card,
          items: card.items.map((item) => {
            if (item.id === "pending-approvals") {
              return {
                ...item,
                subtitle: `${formatCompactCount(summary.pending_review_series)} awaiting`,
              }
            }
            if (item.id === "flagged-content") {
              return {
                ...item,
                subtitle: `${formatCompactCount(summary.flagged_series)} to review`,
              }
            }
            return item
          }),
        }
      }),
    },
  }
}
