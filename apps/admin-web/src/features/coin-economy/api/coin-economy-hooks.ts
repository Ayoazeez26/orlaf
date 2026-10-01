import type {
  AdminCoinPurchaseListQuery,
  CreateAdminCoinBundleRequest,
  UpdateAdminCoinBundleRequest,
} from "@sable/contracts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { mapAdminCoinBundles } from "../lib/map-admin-coin-bundle"
import { mapAdminPurchase } from "../lib/map-admin-purchase"
import type { CoinBundle, CoinPurchase } from "../types"
import {
  createAdminCoinBundle,
  deleteAdminCoinBundle,
  fetchAdminEconomyStats,
  listAdminCoinBundles,
  listAdminCoinPurchases,
  updateAdminCoinBundle,
} from "./coin-economy-api"

export const coinEconomyKeys = {
  all: ["admin", "coin-economy"] as const,
  bundles: () => [...coinEconomyKeys.all, "bundles"] as const,
  purchases: (query: AdminCoinPurchaseListQuery) =>
    [...coinEconomyKeys.all, "purchases", query] as const,
  stats: () => [...coinEconomyKeys.all, "stats"] as const,
}

export function useAdminCoinBundles() {
  return useQuery({
    queryKey: coinEconomyKeys.bundles(),
    queryFn: async (): Promise<CoinBundle[]> => {
      const response = await listAdminCoinBundles()
      return mapAdminCoinBundles(response.items)
    },
  })
}

export function useCreateAdminCoinBundle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateAdminCoinBundleRequest) =>
      createAdminCoinBundle(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coinEconomyKeys.bundles() })
    },
  })
}

export function useUpdateAdminCoinBundle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: UpdateAdminCoinBundleRequest
    }) => updateAdminCoinBundle(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coinEconomyKeys.bundles() })
    },
  })
}

export function useDeleteAdminCoinBundle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminCoinBundle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coinEconomyKeys.bundles() })
    },
  })
}

export function useAdminCoinPurchases(query: AdminCoinPurchaseListQuery = {}) {
  return useQuery({
    queryKey: coinEconomyKeys.purchases(query),
    queryFn: async (): Promise<{ items: CoinPurchase[]; total: number }> => {
      const response = await listAdminCoinPurchases(query)
      return {
        items: response.items.map(mapAdminPurchase),
        total: response.total,
      }
    },
  })
}

export function useAdminEconomyStats() {
  return useQuery({
    queryKey: coinEconomyKeys.stats(),
    queryFn: fetchAdminEconomyStats,
    staleTime: 60_000,
  })
}
