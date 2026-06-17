import type { ProjectSummary } from "../types"

export function formatProjectMeta(project: ProjectSummary) {
  const parts = [project.type, project.genre]

  if (project.episodeCount !== undefined) {
    parts.push(`${project.episodeCount} eps`)
  } else if (project.duration) {
    parts.push(project.duration)
  }

  parts.push(`Updated ${project.updatedAt}`)
  return parts.join(" · ")
}
