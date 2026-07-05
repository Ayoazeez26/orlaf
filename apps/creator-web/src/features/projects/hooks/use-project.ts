import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { archiveKeys } from "@/features/settings/hooks/use-archive"
import {
  archiveProject,
  deleteProject,
  fetchProject,
  updateProjectSettings,
} from "../api/projects-api"
import { projectKeys } from "../data/query-keys"
import type { ProjectDetail } from "../types"

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => fetchProject(id),
    enabled: Boolean(id),
  })
}

export function useUpdateProjectSettings(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      patch: Partial<
        ProjectDetail["visibility"] & ProjectDetail["monetization"]
      >
    ) => updateProjectSettings(projectId, patch),
    onSuccess: (data) => {
      queryClient.setQueryData(projectKeys.detail(projectId), data)
    },
  })
}

export function useArchiveProject(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => archiveProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.list() })
      queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) })
      queryClient.invalidateQueries({ queryKey: archiveKeys.all })
    },
  })
}

export function useDeleteProject(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.list() })
      queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) })
      queryClient.invalidateQueries({ queryKey: archiveKeys.all })
    },
  })
}
