import type {
  AdminCreatorListResponse,
  AdminSuspendCreatorRequest,
} from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getCreator,
  type ListCreatorsParams,
  listCreators,
  reactivateCreator,
  suspendCreator,
  unverifyCreator,
  verifyCreator,
} from "./creators-api"

export const creatorsKeys = {
  all: ["admin", "creators"] as const,
  list: (params: ListCreatorsParams) =>
    [...creatorsKeys.all, "list", params] as const,
  detail: (id: string) => [...creatorsKeys.all, "detail", id] as const,
}

export function useCreatorsQuery(params: ListCreatorsParams) {
  return useQuery<AdminCreatorListResponse>({
    queryKey: creatorsKeys.list(params),
    queryFn: () => listCreators(params),
    placeholderData: (prev) => prev,
  })
}

export function useCreatorQuery(id: string) {
  return useQuery({
    queryKey: creatorsKeys.detail(id),
    queryFn: () => getCreator(id),
    enabled: Boolean(id),
  })
}

export function useVerifyCreator(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (note?: string) => verifyCreator(id, note ? { note } : {}),
    onSuccess: (detail) => {
      queryClient.setQueryData(creatorsKeys.detail(id), detail)
      queryClient.invalidateQueries({ queryKey: creatorsKeys.all })
    },
  })
}

export function useUnverifyCreator(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => unverifyCreator(id),
    onSuccess: (detail) => {
      queryClient.setQueryData(creatorsKeys.detail(id), detail)
      queryClient.invalidateQueries({ queryKey: creatorsKeys.all })
    },
  })
}

export function useSuspendCreator(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: AdminSuspendCreatorRequest) => suspendCreator(id, body),
    onSuccess: (detail) => {
      queryClient.setQueryData(creatorsKeys.detail(id), detail)
      queryClient.invalidateQueries({ queryKey: creatorsKeys.all })
    },
  })
}

export function useReactivateCreator(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => reactivateCreator(id),
    onSuccess: (detail) => {
      queryClient.setQueryData(creatorsKeys.detail(id), detail)
      queryClient.invalidateQueries({ queryKey: creatorsKeys.all })
    },
  })
}
