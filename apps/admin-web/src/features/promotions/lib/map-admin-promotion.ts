import type { AdminPromotionDetail } from "@sable/contracts"
import type { LucideIcon } from "lucide-react"
import {
  CheckCircle2,
  Megaphone,
  Pause,
  Play,
  StopCircle,
  XCircle,
} from "lucide-react"
import type { PromotionActivityEntry, PromotionCampaignDetail } from "../types"

const ACTIVITY_ICONS: Record<string, LucideIcon> = {
  created: Megaphone,
  submitted: Megaphone,
  approved: CheckCircle2,
  rejected: XCircle,
  paused: Pause,
  resumed: Play,
  ended: StopCircle,
  archived: StopCircle,
}

function formatActivityTimestamp(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function mapAdminPromotionDetail(
  detail: AdminPromotionDetail
): PromotionCampaignDetail {
  return {
    id: detail.id,
    title: detail.title,
    creatorId: detail.creatorId,
    creatorName: detail.creatorName,
    schedule: detail.schedule,
    placement: detail.placement,
    placementLabel: detail.placementLabel,
    spent: detail.spent,
    budget: detail.budget,
    impressions: detail.impressions,
    ctr: detail.ctr,
    status: detail.status,
    projectName: detail.projectName,
    reviewerNote: detail.reviewerNote,
    activity: detail.activity.map(
      (entry): PromotionActivityEntry => ({
        id: entry.id,
        label: entry.label,
        timestamp: formatActivityTimestamp(entry.timestamp),
        icon: ACTIVITY_ICONS[entry.action] ?? Megaphone,
      })
    ),
  }
}
