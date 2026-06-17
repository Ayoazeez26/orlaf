import type { PromotionStatusFilter, PromotionSummary } from "../types"

export interface PromotionsListFilters {
  searchQuery: string
  statusFilter: PromotionStatusFilter
}

export const DEFAULT_PROMOTIONS_LIST_FILTERS: PromotionsListFilters = {
  searchQuery: "",
  statusFilter: "all",
}

export function filterPromotions(
  promotions: PromotionSummary[],
  filters: PromotionsListFilters
): PromotionSummary[] {
  const query = filters.searchQuery.trim().toLowerCase()

  return promotions.filter((promotion) => {
    const matchesSearch =
      query === "" ||
      promotion.title.toLowerCase().includes(query) ||
      promotion.projectName.toLowerCase().includes(query)

    const matchesStatus =
      filters.statusFilter === "all" ||
      promotion.status === filters.statusFilter

    return matchesSearch && matchesStatus
  })
}

export function formatPromotionMeta(promotion: PromotionSummary) {
  return `${promotion.projectName} · ${promotion.placement} · ${promotion.startDate} → ${promotion.endDate}`
}

export function formatCurrency(amount: number) {
  return `$${amount}`
}
