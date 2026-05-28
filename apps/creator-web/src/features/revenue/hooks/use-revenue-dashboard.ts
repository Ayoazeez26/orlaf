import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  fetchRevenueDashboard,
  updatePayoutFrequency,
} from "../api/revenue-api"
import { revenueKeys } from "../data/query-keys"
import type { PayoutFrequency } from "../types"

export function useRevenueDashboard() {
  return useQuery({
    queryKey: revenueKeys.dashboard(),
    queryFn: fetchRevenueDashboard,
  })
}

export function useUpdatePayoutFrequency() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (frequency: PayoutFrequency) =>
      updatePayoutFrequency(frequency),
    onSuccess: (data) => {
      queryClient.setQueryData(revenueKeys.dashboard(), data)
    },
  })
}
