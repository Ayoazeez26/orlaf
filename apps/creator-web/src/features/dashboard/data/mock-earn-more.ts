import { Crown, Gift, Lock } from "lucide-react"
import type { DashboardEarnMoreCard } from "../types"

export const MOCK_EARN_MORE_CARDS: DashboardEarnMoreCard[] = [
  {
    id: "memberships",
    title: "Enable Memberships",
    description: "Monthly membership for your biggest fans",
    icon: Crown,
    iconClassName: "text-primary",
    iconBackgroundClassName: "bg-primary/10",
  },
  {
    id: "extras",
    title: "Sell Extras",
    description: "Introducing Extras, the creative way to sell",
    icon: Gift,
    iconClassName: "text-pink-600",
    iconBackgroundClassName: "bg-pink-500/10",
  },
  {
    id: "locked",
    title: "Locked Episodes",
    description: "Publish your best content exclusively",
    icon: Lock,
    iconClassName: "text-violet-600",
    iconBackgroundClassName: "bg-violet-500/10",
  },
]
