import type {
  CreateAdminStaffInviteRequest,
  UpdateAdminTeamMemberRequest,
} from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getAdminTeam,
  inviteAdminMember,
  resendAdminInvite,
  revokeAdminInvite,
  updateAdminMember,
} from "./team-api"

export const teamKeys = {
  all: ["admin", "team"] as const,
}

export function useAdminTeamQuery() {
  return useQuery({
    queryKey: teamKeys.all,
    queryFn: getAdminTeam,
  })
}

export function useInviteAdminMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateAdminStaffInviteRequest) =>
      inviteAdminMember(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: teamKeys.all }),
  })
}

export function useResendAdminInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: resendAdminInvite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: teamKeys.all }),
  })
}

export function useRevokeAdminInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: revokeAdminInvite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: teamKeys.all }),
  })
}

export function useUpdateAdminMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: UpdateAdminTeamMemberRequest
    }) => updateAdminMember(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: teamKeys.all }),
  })
}
