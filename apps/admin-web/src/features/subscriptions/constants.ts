import { Coins, Download, Monitor, Sparkles, Tv, VolumeX } from "lucide-react"
import type { PlanFeature, PurchaseStatus, SubscriptionView } from "./types"

export const SUBSCRIPTION_VIEWS: { key: SubscriptionView; label: string }[] = [
  { key: "plans", label: "Plans" },
  { key: "analytics", label: "Analytics" },
  { key: "purchase-history", label: "Purchase history" },
  { key: "settings", label: "Settings" },
]

export const PURCHASE_FILTERS: {
  key: "all" | PurchaseStatus
  label: string
}[] = [
  { key: "all", label: "All" },
  { key: "paid", label: "Paid" },
  { key: "refunded", label: "Refunded" },
  { key: "failed", label: "Failed" },
]

export const PURCHASE_STATUS_LABEL: Record<PurchaseStatus, string> = {
  paid: "Paid",
  refunded: "Refunded",
  failed: "Failed",
}

export const PURCHASE_STATUS_BADGE_CLASS: Record<PurchaseStatus, string> = {
  paid: "bg-emerald-500/10 text-emerald-600",
  refunded: "bg-muted text-muted-foreground",
  failed: "bg-red-500/10 text-red-600",
}

export const PLAN_FEATURES: PlanFeature[] = [
  { id: "unlimited-episodes", label: "Unlimited episodes", icon: Tv },
  { id: "ad-free", label: "Ad-free experience", icon: VolumeX },
  { id: "offline-downloads", label: "Offline downloads", icon: Download },
  { id: "4k-hdr", label: "4K + HDR streaming", icon: Sparkles },
  { id: "multi-device", label: "Multi-device (up to 4)", icon: Monitor },
  { id: "coin-bonus", label: "10% coin bonus", icon: Coins },
]
