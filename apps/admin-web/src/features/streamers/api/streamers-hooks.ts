import type {
  AdminStreamerListResponse,
  AdminSuspendStreamerRequest,
} from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getStreamer,
  type ListStreamersParams,
  listStreamers,
  reactivateStreamer,
  suspendStreamer,
} from "./streamers-api"

export const streamersKeys = {
  all: ["admin", "streamers"] as const,
  list: (params: ListStreamersParams) =>
    [...streamersKeys.all, "list", params] as const,
  detail: (id: string) => [...streamersKeys.all, "detail", id] as const,
}

export function useStreamersQuery(params: ListStreamersParams) {
  return useQuery<AdminStreamerListResponse>({
    queryKey: streamersKeys.list(params),
    queryFn: () => listStreamers(params),
    placeholderData: (prev) => prev,
  })
}

export function useStreamerQuery(id: string) {
  return useQuery({
    queryKey: streamersKeys.detail(id),
    queryFn: () => getStreamer(id),
    enabled: Boolean(id),
  })
}

export function useSuspendStreamer(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: AdminSuspendStreamerRequest) =>
      suspendStreamer(id, body),
    onSuccess: (detail) => {
      queryClient.setQueryData(streamersKeys.detail(id), detail)
      queryClient.invalidateQueries({ queryKey: streamersKeys.all })
    },
  })
}

export function useReactivateStreamer(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => reactivateStreamer(id),
    onSuccess: (detail) => {
      queryClient.setQueryData(streamersKeys.detail(id), detail)
      queryClient.invalidateQueries({ queryKey: streamersKeys.all })
    },
  })
}
