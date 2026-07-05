import type { ProjectSummary } from "@/features/projects/types"
import type { DashboardProject, DashboardProjectStatus } from "../types"

function toDashboardStatus(
  status: ProjectSummary["status"]
): DashboardProjectStatus {
  if (
    status === "published" ||
    status === "ongoing" ||
    status === "completed"
  ) {
    return "published"
  }
  if (status === "in_review" || status === "scheduled") {
    return "in_review"
  }
  return "draft"
}

export function mapProjectToDashboard(
  project: ProjectSummary
): DashboardProject {
  return {
    id: project.id,
    title: project.title,
    type: project.type,
    genre: project.genre ?? "General",
    episodeCount: project.episodeCount,
    duration: project.duration,
    updatedAt: project.updatedAt,
    views: project.views,
    status: toDashboardStatus(project.status),
    iconVariant: project.iconVariant,
  }
}
