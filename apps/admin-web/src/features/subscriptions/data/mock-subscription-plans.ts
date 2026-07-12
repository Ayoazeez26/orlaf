import type { SubscriptionPlan } from "../types"

export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Get started with ad-supported access.",
    isLive: true,
    tiers: [
      {
        id: "free-forever",
        label: "Free forever",
        price: "$0",
        interval: "forever",
        sublabel: "Ad-supported · SD streaming",
        isSelected: true,
      },
    ],
    includedFeatureIds: [],
  },
  {
    id: "premium",
    name: "Sable TV Premium",
    description: "Unlock every episode, go ad-free and get exclusive perks.",
    isLive: true,
    isMostPopular: true,
    canDelete: true,
    tiers: [
      {
        id: "weekly",
        label: "Weekly",
        price: "$1.99",
        interval: "week",
        sublabel: "Billed weekly · Cancel anytime",
      },
      {
        id: "monthly",
        label: "Monthly",
        price: "$4.99",
        interval: "month",
        sublabel: "Billed monthly · Cancel anytime",
      },
      {
        id: "yearly",
        label: "Yearly",
        price: "$25",
        interval: "year",
        sublabel: "Billed as $25.88/year",
        saveBadge: "Save 40%",
        isBestValue: true,
        isSelected: true,
      },
    ],
    includedFeatureIds: [
      "unlimited-episodes",
      "ad-free",
      "offline-downloads",
      "4k-hdr",
      "multi-device",
      "coin-bonus",
    ],
  },
]
