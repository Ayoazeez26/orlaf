import type { AdminSeriesListItem, SeriesStatus } from "@sable/contracts"
import type { CreatorProject, CreatorProjectStatus } from "../types"

function formatRelativeUpdatedAt(iso: string): string {
  const dateMs = new Date(iso).getTime()
  if (Number.isNaN(dateMs)) return "—"

  const diffMs = Math.max(0, Date.now() - dateMs)
  const minutes = Math.floor(diffMs / 60_000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return "just now"
}

function mapSeriesStatus(status: SeriesStatus): CreatorProjectStatus {
  switch (status) {
    case "published":
      return "published"
    case "in_review":
      return "in-review"
    case "draft":
    case "rejected":
    case "archived":
      return "draft"
  }
}

export function mapAdminSeriesToCreatorProject(
  item: AdminSeriesListItem
): CreatorProject {
  return {
    id: item.id,
    title: item.title,
    type: item.type === "short_film" ? "Short film" : "Short series",
    genre: item.genre || "—",
    meta: `${item.episodeCount} eps`,
    updated: formatRelativeUpdatedAt(item.updatedAt),
    views: item.views ?? undefined,
    status: mapSeriesStatus(item.status),
  }
}
