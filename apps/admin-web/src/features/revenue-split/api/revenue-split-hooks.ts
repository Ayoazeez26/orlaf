import type {
  CreatorRevenueSplitTier,
  UpdateAdminRevenueSplitTierRequest,
} from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { mapRevenueSplitDashboard } from "../lib/map-revenue-split-dashboard"
import {
  fetchAdminRevenueSplit,
  updateAdminRevenueSplitTier,
} from "./revenue-split-api"

export const revenueSplitKeys = {
  all: ["admin-revenue-split"] as const,
  dashboard: () => [...revenueSplitKeys.all, "dashboard"] as const,
}

export function useAdminRevenueSplit() {
  return useQuery({
    queryKey: revenueSplitKeys.dashboard(),
    queryFn: async () => {
      const data = await fetchAdminRevenueSplit()
      return mapRevenueSplitDashboard(data)
    },
  })
}

export function useUpdateRevenueSplitTier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      tierId,
      body,
    }: {
      tierId: CreatorRevenueSplitTier
      body: UpdateAdminRevenueSplitTierRequest
    }) => updateAdminRevenueSplitTier(tierId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: revenueSplitKeys.dashboard(),
      })
    },
  })
}
