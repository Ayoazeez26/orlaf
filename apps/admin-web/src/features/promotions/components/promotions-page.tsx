import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { MOCK_PROMOTION_CAMPAIGNS } from "../data/mock-promotions"
import type {
  NewCampaignFormValues,
  PromotionCampaign,
  PromotionFilter,
} from "../types"
import { ApproveCampaignDialog } from "./dialogs/approve-campaign-dialog"
import { NewCampaignDialog } from "./dialogs/new-campaign-dialog"
import { PauseCampaignDialog } from "./dialogs/pause-campaign-dialog"
import { RejectCampaignDialog } from "./dialogs/reject-campaign-dialog"
import { PromotionsPageHeader } from "./promotions-page-header"
import { PromotionsStatCards } from "./promotions-stat-cards"
import { PromotionsTable } from "./promotions-table"
import { PromotionsToolbar } from "./promotions-toolbar"

function matchesFilter(campaign: PromotionCampaign, filter: PromotionFilter) {
  if (filter === "all") return true
  return campaign.status === filter
}

type PromotionDialogState =
  | { type: "approve"; campaign: PromotionCampaign }
  | { type: "reject"; campaign: PromotionCampaign }
  | { type: "pause"; campaign: PromotionCampaign }
  | { type: "resume"; campaign: PromotionCampaign }
  | null

export function PromotionsPage({ role }: { role: WorkspaceRoleId }) {
  const [campaigns, setCampaigns] = useState(MOCK_PROMOTION_CAMPAIGNS)
  const [activeFilter, setActiveFilter] = useState<PromotionFilter>("all")
  const [search, setSearch] = useState("")
  const [dialog, setDialog] = useState<PromotionDialogState>(null)
  const [newCampaignOpen, setNewCampaignOpen] = useState(false)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return campaigns.filter((campaign) => {
      if (!matchesFilter(campaign, activeFilter)) return false
      if (query) {
        const haystack =
          `${campaign.title} ${campaign.creatorName} ${campaign.placement}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
  }, [activeFilter, campaigns, search])

  function updateCampaignStatus(
    campaignId: string,
    status: PromotionCampaign["status"]
  ) {
    setCampaigns((current) =>
      current.map((campaign) =>
        campaign.id === campaignId ? { ...campaign, status } : campaign
      )
    )
  }

  function createCampaign(values: NewCampaignFormValues) {
    const start = new Date()
    const end = new Date()
    end.setDate(end.getDate() + values.durationDays)

    const formatDate = (date: Date) =>
      date.toLocaleDateString("en-US", { month: "short", day: "2-digit" })

    const slug =
      values.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || `campaign-${Date.now()}`

    const campaign: PromotionCampaign = {
      id: slug,
      title: values.title.trim(),
      creatorName: values.creatorName,
      schedule: `${formatDate(start)} → ${formatDate(end)}`,
      placement: values.placement,
      spent: 0,
      budget: values.budget,
      impressions: 0,
      ctr: 0,
      status: "pending",
    }

    setCampaigns((current) => [campaign, ...current])
    setActiveFilter("pending")
  }

  const activeCampaign = dialog?.campaign ?? null

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <PromotionsPageHeader onNewCampaign={() => setNewCampaignOpen(true)} />
      <PromotionsStatCards campaigns={campaigns} />

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
          <PromotionsToolbar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            search={search}
            onSearchChange={setSearch}
          />
          <PromotionsTable
            campaigns={filtered}
            role={role}
            onApprove={(campaign) => setDialog({ type: "approve", campaign })}
            onReject={(campaign) => setDialog({ type: "reject", campaign })}
            onPause={(campaign) => setDialog({ type: "pause", campaign })}
            onResume={(campaign) => setDialog({ type: "resume", campaign })}
          />
        </CardContent>
      </Card>

      <ApproveCampaignDialog
        open={dialog?.type === "approve"}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
        campaignTitle={activeCampaign?.title ?? ""}
        onConfirm={() => {
          if (activeCampaign) updateCampaignStatus(activeCampaign.id, "live")
        }}
      />

      <RejectCampaignDialog
        open={dialog?.type === "reject"}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
        campaignTitle={activeCampaign?.title ?? ""}
        creatorName={activeCampaign?.creatorName ?? ""}
        onConfirm={() => {
          if (activeCampaign)
            updateCampaignStatus(activeCampaign.id, "rejected")
        }}
      />

      <PauseCampaignDialog
        open={dialog?.type === "pause" || dialog?.type === "resume"}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
        campaignTitle={activeCampaign?.title ?? ""}
        action={dialog?.type === "resume" ? "resume" : "pause"}
        onConfirm={() => {
          if (!activeCampaign) return
          updateCampaignStatus(
            activeCampaign.id,
            dialog?.type === "resume" ? "live" : "paused"
          )
        }}
      />

      <NewCampaignDialog
        open={newCampaignOpen}
        onOpenChange={setNewCampaignOpen}
        onCreate={createCampaign}
      />
    </div>
  )
}
