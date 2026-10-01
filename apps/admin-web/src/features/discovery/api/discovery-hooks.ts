import type {
  CreateDiscoveryRailRequest,
  DiscoverySurface,
  ForYouPreviewResponse,
  SetForYouOverrideRequest,
  UpdateDiscoveryRailRequest,
} from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addDiscoveryRailItem,
  clearForYouOverride,
  createDiscoveryRail,
  deleteDiscoveryRail,
  getForYouPreview,
  listDiscoveryRails,
  removeDiscoveryRailItem,
  reorderDiscoveryRails,
  setForYouOverride,
  updateDiscoveryRail,
} from "./discovery-api"

export const discoveryKeys = {
  all: ["admin", "discovery"] as const,
  forYouPreview: ["admin", "discovery-for-you-preview"] as const,
}

export function useForYouPreviewQuery() {
  return useQuery({
    queryKey: discoveryKeys.forYouPreview,
    queryFn: getForYouPreview,
  })
}

export function useSetForYouOverride() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      seriesId,
      body,
    }: {
      seriesId: string
      body: SetForYouOverrideRequest
    }) => setForYouOverride(seriesId, body),
    onSuccess: (preview: ForYouPreviewResponse) =>
      queryClient.setQueryData(discoveryKeys.forYouPreview, preview),
  })
}

export function useClearForYouOverride() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: clearForYouOverride,
    onSuccess: (preview: ForYouPreviewResponse) =>
      queryClient.setQueryData(discoveryKeys.forYouPreview, preview),
  })
}

export function useDiscoveryRailsQuery() {
  return useQuery({
    queryKey: discoveryKeys.all,
    queryFn: listDiscoveryRails,
  })
}

export function useCreateDiscoveryRail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateDiscoveryRailRequest) => createDiscoveryRail(body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: discoveryKeys.all }),
  })
}

export function useUpdateDiscoveryRail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: UpdateDiscoveryRailRequest
    }) => updateDiscoveryRail(id, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: discoveryKeys.all }),
  })
}

export function useReorderDiscoveryRails() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      surface,
      railIds,
    }: {
      surface: DiscoverySurface
      railIds: string[]
    }) => reorderDiscoveryRails(surface, { railIds }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: discoveryKeys.all }),
  })
}

export function useDeleteDiscoveryRail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteDiscoveryRail,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: discoveryKeys.all }),
  })
}

export function useAddDiscoveryRailItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ railId, seriesId }: { railId: string; seriesId: string }) =>
      addDiscoveryRailItem(railId, { seriesId }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: discoveryKeys.all }),
  })
}

export function useRemoveDiscoveryRailItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ railId, seriesId }: { railId: string; seriesId: string }) =>
      removeDiscoveryRailItem(railId, seriesId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: discoveryKeys.all }),
  })
}
