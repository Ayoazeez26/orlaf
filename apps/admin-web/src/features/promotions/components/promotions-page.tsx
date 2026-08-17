import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { toast, toastMutationError } from "@/lib/toast"
import {
  useAdminPromotionsList,
  useApproveAdminPromotion,
  usePauseAdminPromotion,
  useRejectAdminPromotion,
  useResumeAdminPromotion,
} from "../hooks/use-promotions"
import type { PromotionCampaign, PromotionFilter } from "../types"
import { ApproveCampaignDialog } from "./dialogs/approve-campaign-dialog"
import { PauseCampaignDialog } from "./dialogs/pause-campaign-dialog"
import { RejectCampaignDialog } from "./dialogs/reject-campaign-dialog"
import { PromotionsPageHeader } from "./promotions-page-header"
import { PromotionsStatCards } from "./promotions-stat-cards"
import { PromotionsTable } from "./promotions-table"
import { PromotionsToolbar } from "./promotions-toolbar"

type PromotionDialogState =
  | { type: "approve"; campaign: PromotionCampaign }
  | { type: "reject"; campaign: PromotionCampaign }
  | { type: "pause"; campaign: PromotionCampaign }
  | { type: "resume"; campaign: PromotionCampaign }
  | null

export function PromotionsPage({ role }: { role: WorkspaceRoleId }) {
  const [activeFilter, setActiveFilter] = useState<PromotionFilter>("all")
  const [search, setSearch] = useState("")
  const [dialog, setDialog] = useState<PromotionDialogState>(null)

  const { data, isLoading, isError } = useAdminPromotionsList({
    status: activeFilter,
    search,
  })

  const activeCampaign = dialog?.campaign ?? null
  const activeId = activeCampaign?.id ?? ""

  const approvePromotion = useApproveAdminPromotion(activeId)
  const rejectPromotion = useRejectAdminPromotion(activeId)
  const pausePromotion = usePauseAdminPromotion(activeId)
  const resumePromotion = useResumeAdminPromotion(activeId)

  const filtered = useMemo(() => data?.campaigns ?? [], [data?.campaigns])

  async function handleApprove() {
    if (!activeCampaign) return
    try {
      await approvePromotion.mutateAsync(undefined)
      toast.success("Campaign approved.")
      setDialog(null)
    } catch (error) {
      toastMutationError(error, "Unable to approve campaign.")
    }
  }

  async function handleReject(note?: string) {
    if (!activeCampaign) return
    try {
      await rejectPromotion.mutateAsync(note)
      toast.success("Campaign rejected.")
      setDialog(null)
    } catch (error) {
      toastMutationError(error, "Unable to reject campaign.")
    }
  }

  async function handlePauseOrResume() {
    if (!activeCampaign) return
    try {
      if (dialog?.type === "resume") {
        await resumePromotion.mutateAsync()
        toast.success("Campaign resumed.")
      } else {
        await pausePromotion.mutateAsync(undefined)
        toast.success("Campaign paused.")
      }
      setDialog(null)
    } catch (error) {
      toastMutationError(error, "Unable to update campaign status.")
    }
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <PromotionsPageHeader onNewCampaign={() => {}} />
      {data ? <PromotionsStatCards summary={data.summary} /> : null}

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
          <PromotionsToolbar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            search={search}
            onSearchChange={setSearch}
          />
          {isLoading ? (
            <div className="flex min-h-40 items-center justify-center text-muted-foreground text-sm">
              Loading campaigns…
            </div>
          ) : isError ? (
            <div className="flex min-h-40 items-center justify-center text-destructive text-sm">
              Could not load campaigns.
            </div>
          ) : (
            <PromotionsTable
              campaigns={filtered}
              role={role}
              onApprove={(campaign) => setDialog({ type: "approve", campaign })}
              onReject={(campaign) => setDialog({ type: "reject", campaign })}
              onPause={(campaign) => setDialog({ type: "pause", campaign })}
              onResume={(campaign) => setDialog({ type: "resume", campaign })}
            />
          )}
        </CardContent>
      </Card>

      <ApproveCampaignDialog
        open={dialog?.type === "approve"}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
        campaignTitle={activeCampaign?.title ?? ""}
        onConfirm={() => void handleApprove()}
      />

      <RejectCampaignDialog
        open={dialog?.type === "reject"}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
        campaignTitle={activeCampaign?.title ?? ""}
        creatorName={activeCampaign?.creatorName ?? ""}
        onConfirm={(note) => void handleReject(note)}
      />

      <PauseCampaignDialog
        open={dialog?.type === "pause" || dialog?.type === "resume"}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
        campaignTitle={activeCampaign?.title ?? ""}
        action={dialog?.type === "resume" ? "resume" : "pause"}
        onConfirm={() => void handlePauseOrResume()}
      />
    </div>
  )
}
