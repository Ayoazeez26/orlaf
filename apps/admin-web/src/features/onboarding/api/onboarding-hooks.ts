import type {
  AdminApplicationFilter,
  AdminInviteFilter,
  CreateCreatorInviteRequest,
} from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  approveApplication,
  createInvite,
  getApplication,
  listApplications,
  listInvites,
  rejectApplication,
  reopenApplication,
  resendInvite,
  revokeInvite,
} from "./onboarding-api"

export const onboardingKeys = {
  all: ["admin", "onboarding"] as const,
  applications: (params: { filter?: AdminApplicationFilter; q?: string }) =>
    [...onboardingKeys.all, "applications", params] as const,
  application: (id: string) =>
    [...onboardingKeys.all, "application", id] as const,
  invites: (params: { filter?: AdminInviteFilter; q?: string }) =>
    [...onboardingKeys.all, "invites", params] as const,
}

export function useApplicationsQuery(params: {
  filter?: AdminApplicationFilter
  q?: string
}) {
  return useQuery({
    queryKey: onboardingKeys.applications(params),
    queryFn: () => listApplications(params),
    placeholderData: (prev) => prev,
  })
}

export function useApplicationQuery(id: string) {
  return useQuery({
    queryKey: onboardingKeys.application(id),
    queryFn: () => getApplication(id),
    enabled: Boolean(id),
  })
}

export function useInvitesQuery(params: {
  filter?: AdminInviteFilter
  q?: string
}) {
  return useQuery({
    queryKey: onboardingKeys.invites(params),
    queryFn: () => listInvites(params),
    placeholderData: (prev) => prev,
  })
}

function useApplicationMutation<TArgs = void>(
  id: string,
  fn: (args: TArgs) => Promise<unknown>
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: (detail) => {
      queryClient.setQueryData(onboardingKeys.application(id), detail)
      queryClient.invalidateQueries({ queryKey: onboardingKeys.all })
    },
  })
}

export function useApproveApplication(id: string) {
  return useApplicationMutation<void>(id, () => approveApplication(id))
}

export function useRejectApplication(id: string) {
  return useApplicationMutation<string | undefined>(id, (note) =>
    rejectApplication(id, note ? { note } : {})
  )
}

export function useReopenApplication(id: string) {
  return useApplicationMutation<void>(id, () => reopenApplication(id))
}

export function useCreateInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateCreatorInviteRequest) => createInvite(body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: onboardingKeys.all }),
  })
}

export function useResendInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => resendInvite(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: onboardingKeys.all }),
  })
}

export function useRevokeInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => revokeInvite(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: onboardingKeys.all }),
  })
}
