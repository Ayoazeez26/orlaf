import type { AdminSeriesStats } from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  deleteProject,
  getEpisodePlayback,
  getProject,
  getProjectAnalytics,
  type ListProjectsParams,
  listProjects,
  publishEpisode,
  publishProject,
  rejectEpisode,
  rejectProject,
  unpublishProject,
} from "./projects-api"

export const projectsKeys = {
  all: ["admin", "projects"] as const,
  list: (params: ListProjectsParams) =>
    [...projectsKeys.all, "list", params] as const,
  detail: (id: string) => [...projectsKeys.all, "detail", id] as const,
  analytics: (id: string) => [...projectsKeys.all, "analytics", id] as const,
  playback: (seriesId: string, episodeId: string) =>
    [...projectsKeys.all, "playback", seriesId, episodeId] as const,
}

/** Refetch a signed URL this long before it expires. */
const PLAYBACK_EXPIRY_MARGIN_MS = 5 * 60 * 1000

export function useEpisodePlaybackQuery(
  seriesId: string,
  episodeId: string | null
) {
  return useQuery({
    queryKey: projectsKeys.playback(seriesId, episodeId ?? ""),
    queryFn: () => getEpisodePlayback(seriesId, episodeId as string),
    enabled: Boolean(seriesId && episodeId),
    staleTime: (query) => {
      const expiresAt = query.state.data?.expiresAt
      if (!expiresAt) return 0
      return Math.max(
        0,
        new Date(expiresAt).getTime() - Date.now() - PLAYBACK_EXPIRY_MARGIN_MS
      )
    },
    // A new URL mid-playback would restart the video.
    refetchOnWindowFocus: false,
    retry: false,
  })
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

export function useProjectAnalyticsQuery(id: string) {
  return useQuery({
    queryKey: projectsKeys.analytics(id),
    queryFn: () => getProjectAnalytics(id),
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

export function usePublishEpisode(seriesId: string, episodeId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => publishEpisode(seriesId, episodeId),
    onSuccess: (detail) => {
      queryClient.setQueryData(projectsKeys.detail(seriesId), detail)
      queryClient.invalidateQueries({ queryKey: projectsKeys.all })
    },
  })
}

export function useRejectEpisode(seriesId: string, episodeId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => rejectEpisode(seriesId, episodeId),
    onSuccess: (detail) => {
      queryClient.setQueryData(projectsKeys.detail(seriesId), detail)
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
