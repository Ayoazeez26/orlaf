import type { AdminSeriesStats } from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  deleteProject,
  getProject,
  type ListProjectsParams,
  listProjects,
  publishProject,
  rejectProject,
  unpublishProject,
} from "./projects-api"

export const projectsKeys = {
  all: ["admin", "projects"] as const,
  list: (params: ListProjectsParams) =>
    [...projectsKeys.all, "list", params] as const,
  detail: (id: string) => [...projectsKeys.all, "detail", id] as const,
}

export function useProjectsQuery(params: ListProjectsParams) {
  return useQuery({
    queryKey: projectsKeys.list(params),
    queryFn: () => listProjects(params),
    placeholderData: (prev) => prev,
  })
}

export function useProjectQuery(id: string) {
  return useQuery({
    queryKey: projectsKeys.detail(id),
    queryFn: () => getProject(id),
    enabled: Boolean(id),
  })
}

export function usePublishProject(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (note?: string) => publishProject(id, note ? { note } : {}),
    onSuccess: (detail) => {
      queryClient.setQueryData(projectsKeys.detail(id), detail)
      queryClient.invalidateQueries({ queryKey: projectsKeys.all })
    },
  })
}

export function useRejectProject(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (note?: string) => rejectProject(id, note ? { note } : {}),
    onSuccess: (detail) => {
      queryClient.setQueryData(projectsKeys.detail(id), detail)
      queryClient.invalidateQueries({ queryKey: projectsKeys.all })
    },
  })
}

export function useUnpublishProject(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (note?: string) => unpublishProject(id, note ? { note } : {}),
    onSuccess: (detail) => {
      queryClient.setQueryData(projectsKeys.detail(id), detail)
      queryClient.invalidateQueries({ queryKey: projectsKeys.all })
    },
  })
}

export function useDeleteProject(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteProject(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: projectsKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: projectsKeys.all })
    },
  })
}

export const EMPTY_PROJECT_STATS: AdminSeriesStats = {
  total: 0,
  pendingReview: 0,
  approved: 0,
  rejected: 0,
}
