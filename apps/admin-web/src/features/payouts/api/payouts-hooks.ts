import type {
  AdminPayoutListQuery,
  ApproveAdminPayoutRequest,
} from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  approveAdminPayout,
  fetchAdminPayoutStats,
  listAdminPayouts,
  markAdminPayoutPaid,
} from "./payouts-api"

export const payoutKeys = {
  all: ["admin-payouts"] as const,
  list: (query: AdminPayoutListQuery = {}) =>
    [...payoutKeys.all, "list", query] as const,
  stats: () => [...payoutKeys.all, "stats"] as const,
}

export function useAdminPayouts(query: AdminPayoutListQuery = {}) {
  return useQuery({
    queryKey: payoutKeys.list(query),
    queryFn: () => listAdminPayouts(query),
  })
}

export function useAdminPayoutStats() {
  return useQuery({
    queryKey: payoutKeys.stats(),
    queryFn: () => fetchAdminPayoutStats(),
  })
}

export function useCreatorPayouts(creatorId: string) {
  return useAdminPayouts({ creator_id: creatorId, pageSize: 50 })
}

export function useApproveAdminPayout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      payoutId,
      body,
    }: {
      payoutId: string
      body: ApproveAdminPayoutRequest
    }) => approveAdminPayout(payoutId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: payoutKeys.all })
    },
  })
}

export function useMarkAdminPayoutPaid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payoutId: string) => markAdminPayoutPaid(payoutId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: payoutKeys.all })
    },
  })
}
