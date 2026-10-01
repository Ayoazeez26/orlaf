import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createPayoutAccount,
  deletePayoutAccount,
  fetchRevenueDashboard,
  requestPayout,
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

export function useCreatePayoutAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPayoutAccount,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: revenueKeys.dashboard() })
    },
  })
}

export function useDeletePayoutAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePayoutAccount,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: revenueKeys.dashboard() })
    },
  })
}

export function useRequestPayout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (amountMinor: number) =>
      requestPayout({ amount_minor: amountMinor }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: revenueKeys.dashboard() })
    },
  })
}
