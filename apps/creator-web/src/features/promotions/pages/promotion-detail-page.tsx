import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import { ConfirmDeleteDialog } from "@/features/settings/components/confirm-delete-dialog"
import { toast, toastMutationError } from "@/lib/toast"
import {
  PromotionActionsCard,
  PromotionMetricCards,
} from "../components/detail/promotion-detail-metrics"
import { PromotionPerformanceCard } from "../components/detail/promotion-performance-card"
import { EditCampaignDialog } from "../components/modals/edit-campaign-dialog"
import { PromotionStatusBadge } from "../components/shared/promotion-status-badge"
import {
  useArchivePromotion,
  useEndPromotion,
  usePausePromotion,
  usePromotionDetail,
  useResumePromotion,
} from "../hooks/use-promotions"
import { formatPromotionMeta } from "../lib/filter-promotions"

export function PromotionDetailPage() {
  const { promotionId } = useParams({ strict: false })
  const navigate = useNavigate()
  const id = promotionId ?? ""

  const { data: promotion, isLoading, isError } = usePromotionDetail(id)

  const pausePromotion = usePausePromotion(id)
  const resumePromotion = useResumePromotion(id)
  const endPromotion = useEndPromotion(id)
  const archivePromotion = useArchivePromotion()

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const isPending =
    pausePromotion.isPending ||
    resumePromotion.isPending ||
    endPromotion.isPending ||
    archivePromotion.isPending

  async function handlePause() {
    try {
      await pausePromotion.mutateAsync()
      toast.success("Promotion paused.")
    } catch (error) {
      toastMutationError(error, "Unable to pause this promotion.")
    }
  }

  async function handleResume() {
    try {
      await resumePromotion.mutateAsync()
      toast.success("Promotion resumed.")
    } catch (error) {
      toastMutationError(error, "Unable to resume this promotion.")
    }
  }

  async function handleEnd() {
    try {
      await endPromotion.mutateAsync()
      toast.success("Promotion ended.")
    } catch (error) {
      toastMutationError(error, "Unable to end this promotion.")
    }
  }

  async function handleDelete() {
    try {
      await archivePromotion.mutateAsync(id)
      toast.success("Promotion deleted.")
      navigate({ to: "/dashboard/promotions" })
    } catch (error) {
      toastMutationError(error, "Unable to delete this promotion.")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(["a", "b", "c", "d"] as const).map((key) => (
            <div
              key={key}
              className="h-28 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !promotion) {
    return (
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <Link
          to="/dashboard/promotions"
          className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Back to Promotions
        </Link>
        <p className="text-destructive text-sm">
          Could not load this promotion. Please try again.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <div className="space-y-4">
        <Link
          to="/dashboard/promotions"
          className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Back to Promotions
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
                {promotion.title}
              </h1>
              <PromotionStatusBadge status={promotion.status} />
            </div>
            <p className="text-muted-foreground text-sm">
              {formatPromotionMeta(promotion)}
            </p>
            {promotion.reviewerNote ? (
              <p className="text-destructive text-sm">
                Review note: {promotion.reviewerNote}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <PromotionMetricCards
        budget={promotion.budget}
        spent={promotion.spent}
        impressionsLabel={promotion.impressionsLabel}
        ctr={promotion.ctr}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <PromotionPerformanceCard
          data={promotion.performanceData}
          spent={promotion.spent}
          progressPercent={promotion.progressPercent}
          projectName={promotion.projectName}
          placement={promotion.placementLabel}
          startDate={promotion.startDate}
          endDate={promotion.endDate}
          goal={promotion.goal}
          audience={promotion.audience}
          className="lg:col-span-2"
        />
        <PromotionActionsCard
          status={promotion.status}
          isPending={isPending}
          onEdit={() => setEditOpen(true)}
          onPause={() => void handlePause()}
          onResume={() => void handleResume()}
          onEnd={() => void handleEnd()}
          onDelete={() => setDeleteOpen(true)}
        />
      </div>

      <EditCampaignDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        promotion={promotion}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete promotion?"
        description={`Permanently remove “${promotion.title}”? This cannot be undone.`}
        onConfirm={() => {
          setDeleteOpen(false)
          void handleDelete()
        }}
      />
    </div>
  )
}
