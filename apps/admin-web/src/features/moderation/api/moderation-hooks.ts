import type {
  ModerationListQuery,
  UpdateModerationReportRequest,
} from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getModerationReport,
  listModerationReports,
  updateModerationReport,
} from "./moderation-api"

export const moderationKeys = {
  all: ["admin", "moderation"] as const,
  list: (params: ModerationListQuery) =>
    [...moderationKeys.all, "list", params] as const,
  detail: (id: string) => [...moderationKeys.all, "detail", id] as const,
}

export function useModerationReportsQuery(params: ModerationListQuery) {
  return useQuery({
    queryKey: moderationKeys.list(params),
    queryFn: () => listModerationReports(params),
    placeholderData: (prev) => prev,
  })
}

export function useModerationReportQuery(id: string) {
  return useQuery({
    queryKey: moderationKeys.detail(id),
    queryFn: () => getModerationReport(id),
    enabled: Boolean(id),
  })
}

export function useUpdateModerationReport(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateModerationReportRequest) =>
      updateModerationReport(id, body),
    onSuccess: (detail) => {
      queryClient.setQueryData(moderationKeys.detail(id), detail)
      queryClient.invalidateQueries({ queryKey: moderationKeys.all })
    },
  })
}
