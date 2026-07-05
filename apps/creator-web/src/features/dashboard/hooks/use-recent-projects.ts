import { useQuery } from "@tanstack/react-query"
import { fetchProjects } from "@/features/projects/api/projects-api"
import { projectKeys } from "@/features/projects/data/query-keys"
import { mapProjectToDashboard } from "../lib/map-dashboard-project"
import type { DashboardProject } from "../types"

const RECENT_PROJECTS_LIMIT = 3

function selectRecentProjects(
  projects: Awaited<ReturnType<typeof fetchProjects>>
) {
  return [...projects]
    .sort((a, b) => b.updatedAtMs - a.updatedAtMs)
    .slice(0, RECENT_PROJECTS_LIMIT)
    .map(mapProjectToDashboard)
}

export function useRecentProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: fetchProjects,
    select: selectRecentProjects,
  })
}

export type { DashboardProject }
