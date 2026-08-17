import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { PromotionCard } from "../components/list/promotion-card"
import { PromotionListRow } from "../components/list/promotion-list-row"
import {
  PromotionsListSkeleton,
  PromotionsListToolbar,
} from "../components/list/promotions-list-toolbar"
import { PromotionsSummaryCards } from "../components/list/promotions-summary-cards"
import { NewPromotionDialog } from "../components/modals/new-promotion-dialog"
import { usePromotionsList } from "../hooks/use-promotions"
import {
  DEFAULT_PROMOTIONS_LIST_FILTERS,
  filterPromotions,
} from "../lib/filter-promotions"

export function PromotionsListPage() {
  const { data, isLoading, isError } = usePromotionsList()
  const [layout, setLayout] = useState<"grid" | "list">("list")
  const [filters, setFilters] = useState(DEFAULT_PROMOTIONS_LIST_FILTERS)
  const [newPromotionOpen, setNewPromotionOpen] = useState(false)

  const filteredPromotions = useMemo(
    () => (data ? filterPromotions(data.promotions, filters) : []),
    [data, filters]
  )

  const showEmptyResults =
    data && data.promotions.length > 0 && filteredPromotions.length === 0

  function updateFilters(patch: Partial<typeof filters>) {
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
            Promotions
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Run targeted campaigns to grow your audience
          </p>
        </div>
        <Button
          type="button"
          className="shrink-0 gap-2"
          onClick={() => setNewPromotionOpen(true)}
        >
          <Plus className="size-4" aria-hidden />
          New promotion
        </Button>
      </div>

      {data && <PromotionsSummaryCards kpis={data.summaryKpis} />}

      {isLoading && <PromotionsListSkeleton />}

      {isError && (
        <p className="text-destructive text-sm">
          Could not load promotions. Please try again.
        </p>
      )}

      {data && data.promotions.length === 0 && (
        <p className="text-muted-foreground text-sm">
          No promotions yet. Create your first campaign to reach more viewers.
        </p>
      )}

      {showEmptyResults && (
        <p className="text-muted-foreground text-sm">
          No promotions match your search or filters.
        </p>
      )}

      {data && filteredPromotions.length > 0 && layout === "list" && (
        <div className={`overflow-hidden ${FROSTED_CARD_SURFACE_CLASS}`}>
          <PromotionsListToolbar
            layout={layout}
            onLayoutChange={setLayout}
            filters={filters}
            onFiltersChange={updateFilters}
          />
          <div>
            {filteredPromotions.map((promotion, index) => (
              <div
                key={promotion.id}
                className={index > 0 ? "border-border border-t" : undefined}
              >
                <PromotionListRow promotion={promotion} />
              </div>
            ))}
          </div>
        </div>
      )}

      {data && filteredPromotions.length > 0 && layout === "grid" && (
        <div className="space-y-6">
          <div className={`overflow-hidden ${FROSTED_CARD_SURFACE_CLASS}`}>
            <PromotionsListToolbar
              layout={layout}
              onLayoutChange={setLayout}
              filters={filters}
              onFiltersChange={updateFilters}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredPromotions.map((promotion) => (
              <PromotionCard key={promotion.id} promotion={promotion} />
            ))}
          </div>
        </div>
      )}

      <NewPromotionDialog
        open={newPromotionOpen}
        onOpenChange={setNewPromotionOpen}
      />
    </div>
  )
}
