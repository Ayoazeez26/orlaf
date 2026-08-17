import type {
  CreateStudioInviteRequest,
  StudioTeamResponse,
} from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getActiveStudioId } from "@/lib/studio-id"
import {
  acceptStudioInvite,
  getStudioMemberships,
  getStudioTeam,
  inviteStudioMember,
  removeStudioMember,
  resendStudioInvite,
  revokeStudioInvite,
} from "./team-api"

export const studioTeamKeys = {
  memberships: ["studio", "memberships"] as const,
  team: (studioId: string | null) => ["studio", "team", studioId] as const,
}

export function useStudioMembershipsQuery() {
  return useQuery({
    queryKey: studioTeamKeys.memberships,
    queryFn: getStudioMemberships,
  })
}

export function useStudioTeamQuery(enabled = true) {
  const studioId = getActiveStudioId()
  return useQuery({
    queryKey: studioTeamKeys.team(studioId),
    queryFn: getStudioTeam,
    enabled,
  })
}

export function useInviteStudioMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateStudioInviteRequest) => inviteStudioMember(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["studio"] }),
  })
}

export function useResendStudioInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: resendStudioInvite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["studio"] }),
  })
}

export function useRevokeStudioInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: revokeStudioInvite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["studio"] }),
  })
}

export function useRemoveStudioMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: removeStudioMember,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["studio"] }),
  })
}

export function useAcceptStudioInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: acceptStudioInvite,
    onSuccess: (team: StudioTeamResponse) => {
      queryClient.invalidateQueries({ queryKey: ["studio"] })
      return team
    },
  })
}
