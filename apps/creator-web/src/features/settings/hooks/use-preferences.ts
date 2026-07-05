import type { CreatorPreferences } from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchPreferences, updatePreferences } from "../api/preferences-api"
import { profileKeys } from "../data/query-keys"

export function usePreferences() {
  return useQuery({
    queryKey: profileKeys.preferences(),
    queryFn: fetchPreferences,
  })
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePreferences,
    onSuccess: (data) => {
      queryClient.setQueryData<CreatorPreferences>(
        profileKeys.preferences(),
        data
      )
    },
  })
}
