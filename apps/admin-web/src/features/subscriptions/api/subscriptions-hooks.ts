import type { AdminSubscriptionPurchaseListQuery } from "@sable/contracts"
import { useQuery } from "@tanstack/react-query"
import {
  mapAdminPlans,
  mapAdminPurchase,
  mapAnalyticsMetrics,
  mapMrrTrend,
  mapPlanMix,
  mapSubscriptionSummary,
} from "../lib/map-admin-subscriptions"
import {
  fetchAdminSubscriptionPlans,
  fetchAdminSubscriptionSettings,
  fetchAdminSubscriptionStats,
  listAdminSubscriptionPurchases,
} from "./subscriptions-api"

export const subscriptionKeys = {
  all: ["admin-subscriptions"] as const,
  stats: () => [...subscriptionKeys.all, "stats"] as const,
  plans: () => [...subscriptionKeys.all, "plans"] as const,
  settings: () => [...subscriptionKeys.all, "settings"] as const,
  purchases: (query: AdminSubscriptionPurchaseListQuery) =>
    [...subscriptionKeys.all, "purchases", query] as const,
}

export function useAdminSubscriptionSettings() {
  return useQuery({
    queryKey: subscriptionKeys.settings(),
    queryFn: fetchAdminSubscriptionSettings,
  })
}

export function useAdminSubscriptionStats() {
  return useQuery({
    queryKey: subscriptionKeys.stats(),
    queryFn: async () => {
      const stats = await fetchAdminSubscriptionStats()
      return {
        summary: mapSubscriptionSummary(stats),
        mrrTrend: mapMrrTrend(stats),
        planMix: mapPlanMix(stats),
        metrics: mapAnalyticsMetrics(stats),
      }
    },
  })
}

export function useAdminSubscriptionPlans() {
  return useQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: async () => {
      const response = await fetchAdminSubscriptionPlans()
      return mapAdminPlans(response.items)
    },
  })
}

export function useAdminSubscriptionPurchases(
  query: AdminSubscriptionPurchaseListQuery = {}
) {
  return useQuery({
    queryKey: subscriptionKeys.purchases(query),
    queryFn: async () => {
      const response = await listAdminSubscriptionPurchases(query)
      return {
        items: response.items.map(mapAdminPurchase),
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
      }
    },
  })
}
