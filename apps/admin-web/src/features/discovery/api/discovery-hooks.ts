import type {
  CreateDiscoveryRailRequest,
  DiscoverySurface,
  UpdateDiscoveryRailRequest,
} from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addDiscoveryRailItem,
  createDiscoveryRail,
  deleteDiscoveryRail,
  listDiscoveryRails,
  removeDiscoveryRailItem,
  reorderDiscoveryRails,
  updateDiscoveryRail,
} from "./discovery-api"

export const discoveryKeys = {
  all: ["admin", "discovery"] as const,
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
