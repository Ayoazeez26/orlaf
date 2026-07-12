import { useState } from "react"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
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
  campaign: initialCampaign,
  role,
}: PromotionDetailPageProps) {
  const [campaign, setCampaign] = useState(initialCampaign)
  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [pauseOpen, setPauseOpen] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)

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
        />
      </div>

      <PromotionActivityCard campaign={campaign} />

      <ApproveCampaignDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        campaignTitle={campaign.title}
        onConfirm={() =>
          setCampaign((current) => ({ ...current, status: "live" }))
        }
      />

      <RejectCampaignDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        campaignTitle={campaign.title}
        creatorName={campaign.creatorName}
        variant="simple"
        onConfirm={() =>
          setCampaign((current) => ({ ...current, status: "rejected" }))
        }
      />

      <PauseCampaignDialog
        open={pauseOpen}
        onOpenChange={setPauseOpen}
        campaignTitle={campaign.title}
        action="pause"
        onConfirm={() =>
          setCampaign((current) => ({ ...current, status: "paused" }))
        }
      />

      <InternalNoteDialog
        open={noteOpen}
        onOpenChange={setNoteOpen}
        initialNote={campaign.reviewerNote}
        onSave={(note) =>
          setCampaign((current) => ({ ...current, reviewerNote: note }))
        }
      />
    </div>
  )
}
