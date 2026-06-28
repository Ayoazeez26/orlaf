import type {
  ProfileResponse,
  UpdateProfileRequest,
  UpdateSocialLinksRequest,
  UpdateStudioRequest,
} from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  fetchProfile,
  updateProfile,
  updateSocialLinks,
  updateStudio,
} from "../api/profile-api"
import { profileKeys } from "../data/query-keys"

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: fetchProfile,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patch: UpdateProfileRequest) => updateProfile(patch),
    onSuccess: (data) => {
      queryClient.setQueryData<ProfileResponse>(profileKeys.me(), (prev) =>
        prev ? { ...prev, ...data } : prev
      )
    },
  })
}

export function useUpdateSocialLinks() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patch: UpdateSocialLinksRequest) => updateSocialLinks(patch),
    onSuccess: (data) => {
      queryClient.setQueryData<ProfileResponse>(profileKeys.me(), (prev) =>
        prev ? { ...prev, ...data } : prev
      )
    },
  })
}

export function useUpdateStudio() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patch: UpdateStudioRequest) => updateStudio(patch),
    onSuccess: (data) => {
      queryClient.setQueryData<ProfileResponse>(profileKeys.me(), (prev) =>
        prev ? { ...prev, creatorProfile: data } : prev
      )
    },
  })
}
