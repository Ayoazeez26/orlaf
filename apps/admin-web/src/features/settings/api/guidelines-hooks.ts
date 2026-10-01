import type { UpdateGuidelinesRequest } from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getGuidelines, updateGuidelines } from "./guidelines-api"

export const guidelinesKeys = {
  all: ["guidelines"] as const,
}

export function useGuidelinesQuery() {
  return useQuery({
    queryKey: guidelinesKeys.all,
    queryFn: getGuidelines,
  })
}

export function useUpdateGuidelines() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateGuidelinesRequest) => updateGuidelines(body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: guidelinesKeys.all }),
  })
}
