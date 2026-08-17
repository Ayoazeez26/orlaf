import type { Project } from "../types"

export function formatProjectViews(views: number | null): string {
  if (views == null) return "—"
  if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  }
  if (views >= 1_000) {
    return `${Math.round(views / 1_000)}K`
  }
  return views.toLocaleString()
}

export function projectSubtitle(
  project: Pick<Project, "genre" | "language" | "episodeCount">
): string {
  return `${project.genre} • ${project.language} • ${project.episodeCount} episodes`
}
