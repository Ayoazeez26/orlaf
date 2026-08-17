import { useState } from "react"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { toast, toastMutationError } from "@/lib/toast"
import {
  useApproveAdminPromotion,
  useEndAdminPromotion,
  usePauseAdminPromotion,
  useRejectAdminPromotion,
} from "../../hooks/use-promotions"
import type { PromotionCampaignDetail } from "../../types"
import { ApproveCampaignDialog } from "../dialogs/approve-campaign-dialog"
import { InternalNoteDialog } from "../dialogs/internal-note-dialog"
import { PauseCampaignDialog } from "../dialogs/pause-campaign-dialog"
import { RejectCampaignDialog } from "../dialogs/reject-campaign-dialog"
import { PromotionActionsCard } from "./promotion-actions-card"
import { PromotionActivityCard } from "./promotion-activity-card"
import { PromotionDetailHeader } from "./promotion-detail-header"
import { PromotionDetailStatCards } from "./promotion-detail-stat-cards"
import { PromotionOverviewCard } from "./promotion-overview-card"

interface PromotionDetailPageProps {
  campaign: PromotionCampaignDetail
  role: WorkspaceRoleId
}

export function PromotionDetailPage({
  campaign,
  role,
}: PromotionDetailPageProps) {
  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [pauseOpen, setPauseOpen] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)

  const approvePromotion = useApproveAdminPromotion(campaign.id)
  const rejectPromotion = useRejectAdminPromotion(campaign.id)
  const pausePromotion = usePauseAdminPromotion(campaign.id)
  const endPromotion = useEndAdminPromotion(campaign.id)

  async function handleApprove() {
    try {
      await approvePromotion.mutateAsync(undefined)
      toast.success("Campaign approved.")
    } catch (error) {
      toastMutationError(error, "Unable to approve campaign.")
    }
  }

  async function handleReject(note?: string) {
    try {
      await rejectPromotion.mutateAsync(note)
      toast.success("Campaign rejected.")
    } catch (error) {
      toastMutationError(error, "Unable to reject campaign.")
    }
  }

  async function handlePause() {
    try {
      await pausePromotion.mutateAsync(undefined)
      toast.success("Campaign paused.")
    } catch (error) {
      toastMutationError(error, "Unable to pause campaign.")
    }
  }

  async function handleEnd() {
    try {
      await endPromotion.mutateAsync(undefined)
      toast.success("Campaign ended.")
    } catch (error) {
      toastMutationError(error, "Unable to end campaign.")
    }
  }

  return (
    <div className="space-y-6">
      <PromotionDetailHeader campaign={campaign} role={role} />
      <PromotionDetailStatCards campaign={campaign} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PromotionOverviewCard
            campaign={campaign}
            role={role}
            onAddNote={() => setNoteOpen(true)}
          />
        </div>
        <PromotionActionsCard
          campaign={campaign}
          onPause={() => setPauseOpen(true)}
          onReject={() => setRejectOpen(true)}
          onApprove={() => setApproveOpen(true)}
          onEnd={() => void handleEnd()}
        />
      </div>

      <PromotionActivityCard campaign={campaign} />

      <ApproveCampaignDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        campaignTitle={campaign.title}
        onConfirm={() => void handleApprove()}
      />

      <RejectCampaignDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        campaignTitle={campaign.title}
        creatorName={campaign.creatorName}
        variant="simple"
        onConfirm={(note) => void handleReject(note)}
      />

      <PauseCampaignDialog
        open={pauseOpen}
        onOpenChange={setPauseOpen}
        campaignTitle={campaign.title}
        action="pause"
        onConfirm={() => void handlePause()}
      />

      <InternalNoteDialog
        open={noteOpen}
        onOpenChange={setNoteOpen}
        initialNote={campaign.reviewerNote}
        onSave={() => setNoteOpen(false)}
      />
    </div>
  )
}
