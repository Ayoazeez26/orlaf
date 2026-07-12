import { CheckCircle2, Megaphone } from "lucide-react"
import type { PromotionCampaignDetail } from "../types"
import { MOCK_PROMOTION_CAMPAIGNS } from "./mock-promotions"

const DETAIL_OVERRIDES: Record<string, Partial<PromotionCampaignDetail>> = {
  "lagos-nights-s2": {
    projectName: "Lagos Nights",
    reviewerNote: null,
    activity: [
      {
        id: "submitted",
        label: "Campaign submitted for review",
        timestamp: "May 02",
        icon: Megaphone,
      },
      {
        id: "live",
        label: "Status updated to Live",
        timestamp: "May 02",
        icon: CheckCircle2,
      },
    ],
  },
}

export function getPromotionDetail(
  campaignId: string
): PromotionCampaignDetail | null {
  const campaign = MOCK_PROMOTION_CAMPAIGNS.find(
    (item) => item.id === campaignId
  )
  if (!campaign) return null

  const override = DETAIL_OVERRIDES[campaignId]

  return {
    ...campaign,
    projectName: override?.projectName ?? campaign.title,
    reviewerNote: override?.reviewerNote ?? null,
    activity: override?.activity ?? [
      {
        id: "submitted",
        label: "Campaign submitted for review",
        timestamp: campaign.schedule.split(" → ")[0] ?? "—",
        icon: Megaphone,
      },
    ],
  }
}
