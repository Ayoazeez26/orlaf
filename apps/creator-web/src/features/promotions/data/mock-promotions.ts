import { DollarSign, Eye, LineChart, Megaphone } from "lucide-react"
import type { PromotionDetail, PromotionsListData } from "../types"

export const MOCK_PROMOTIONS_LIST: PromotionsListData = {
  summaryKpis: [
    { label: "Active", value: "1", icon: Megaphone },
    { label: "Total Spend", value: "$530", icon: DollarSign },
    { label: "Impressions", value: "44.6k", icon: Eye },
    { label: "Avg. CTR", value: "5.7%", icon: LineChart },
  ],
  promotions: [
    {
      id: "premiere-boost-ep-04",
      title: "Premiere Boost — Ep. 04",
      status: "active",
      projectName: "Lagos After Dark",
      placement: "Home banner",
      startDate: "May 02",
      endDate: "May 24",
      spent: 138,
      budget: 200,
      progressPercent: 69,
      impressions: "12.4k",
      ctr: "4.7%",
    },
    {
      id: "subscribe-drive-may",
      title: "Subscribe drive — May",
      status: "paused",
      projectName: "Lagos After Dark",
      placement: "Series page",
      startDate: "May 01",
      endDate: "May 31",
      spent: 92,
      budget: 150,
      progressPercent: 61,
      impressions: "8.2k",
      ctr: "3.2%",
    },
    {
      id: "studio-sessions-teaser",
      title: "Studio Sessions teaser",
      status: "completed",
      projectName: "Studio Sessions",
      placement: "Home banner",
      startDate: "Apr 01",
      endDate: "Apr 30",
      spent: 300,
      budget: 300,
      progressPercent: 100,
      impressions: "24.0k",
      ctr: "6.1%",
    },
  ],
}

const PERFORMANCE_DATA = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  impressions: Math.round(400 + Math.sin(i * 0.8) * 200 + i * 45),
}))

function promotionSummary(id: string) {
  const promotion = MOCK_PROMOTIONS_LIST.promotions.find(
    (item) => item.id === id
  )
  if (!promotion) {
    throw new Error(`Missing mock promotion: ${id}`)
  }
  return promotion
}

export const MOCK_PROMOTION_DETAILS: Record<string, PromotionDetail> = {
  "premiere-boost-ep-04": {
    ...promotionSummary("premiere-boost-ep-04"),
    ctr: "4.7%",
    goal: "views",
    audience: "all_viewers",
    performanceData: PERFORMANCE_DATA,
  },
  "subscribe-drive-may": {
    ...promotionSummary("subscribe-drive-may"),
    ctr: "3.2%",
    goal: "subscribers",
    audience: "subscribers",
    performanceData: PERFORMANCE_DATA.map((p) => ({
      ...p,
      impressions: Math.round(p.impressions * 0.7),
    })),
  },
  "studio-sessions-teaser": {
    ...promotionSummary("studio-sessions-teaser"),
    ctr: "6.1%",
    goal: "views",
    audience: "new_viewers",
    performanceData: PERFORMANCE_DATA.map((p) => ({
      ...p,
      impressions: Math.round(p.impressions * 1.4),
    })),
  },
}
