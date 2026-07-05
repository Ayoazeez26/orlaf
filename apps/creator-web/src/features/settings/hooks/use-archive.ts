import type { ArchiveItemType } from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  type ArchiveFilter,
  deleteArchiveItem,
  emptyArchive,
  fetchArchive,
  restoreArchiveItem,
} from "../api/archive-api"

export const archiveKeys = {
  all: ["archive"] as const,
  list: (filter: ArchiveFilter) =>
    [...archiveKeys.all, "list", filter] as const,
}

export function useArchive(filter: ArchiveFilter = "all") {
  return useQuery({
    queryKey: archiveKeys.list(filter),
    queryFn: () => fetchArchive(filter === "promotion" ? "promotion" : filter),
  })
}

export function useRestoreArchiveItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      type,
      entityId,
    }: {
      type: ArchiveItemType
      entityId: string
    }) => restoreArchiveItem(type, entityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.all })
    },
  })
}

export function useDeleteArchiveItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      type,
      entityId,
    }: {
      type: ArchiveItemType
      entityId: string
    }) => deleteArchiveItem(type, entityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.all })
    },
  })
}

export function useEmptyArchive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: emptyArchive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: archiveKeys.all })
    },
  })
}
