import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { archiveKeys } from "@/features/settings/hooks/use-archive"
import {
  archiveProject,
  deleteProject,
  fetchProject,
  type ProjectSettingsPatch,
  updateProjectSettings,
} from "../api/projects-api"
import { archiveEpisode, reorderEpisodes } from "../api/studio-api"
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
    mutationFn: (patch: ProjectSettingsPatch) =>
      updateProjectSettings(projectId, patch),
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

export function useArchiveEpisode(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (episodeId: string) => archiveEpisode(projectId, episodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) })
      queryClient.invalidateQueries({ queryKey: archiveKeys.all })
    },
  })
}

export function useReorderEpisodes(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (episodeIds: string[]) =>
      reorderEpisodes(projectId, { episodeIds }),
    onMutate: async (episodeIds) => {
      await queryClient.cancelQueries({
        queryKey: projectKeys.detail(projectId),
      })
      const previous = queryClient.getQueryData<ProjectDetail>(
        projectKeys.detail(projectId)
      )

      if (previous) {
        const byId = new Map(previous.episodes.map((ep) => [ep.id, ep]))
        const reordered = episodeIds
          .map((id, index) => {
            const episode = byId.get(id)
            if (!episode) return null
            return { ...episode, number: index + 1 }
          })
          .filter((episode): episode is NonNullable<typeof episode> =>
            Boolean(episode)
          )

        queryClient.setQueryData<ProjectDetail>(projectKeys.detail(projectId), {
          ...previous,
          episodes: reordered,
          recentEpisodes: reordered.slice(0, 5),
        })
      }

      return { previous }
    },
    onError: (_error, _episodeIds, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          projectKeys.detail(projectId),
          context.previous
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) })
    },
  })
}
