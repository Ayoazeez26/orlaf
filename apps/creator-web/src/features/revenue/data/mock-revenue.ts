import { Coins, CreditCard, Gift, Tv } from "lucide-react"
import { MOCK_DASHBOARD_HOME } from "@/features/dashboard/data/mock-home"
import type { RevenueDashboardData } from "../types"

export const MOCK_REVENUE_DASHBOARD: RevenueDashboardData = {
  earningsSummary: {
    total: "$18,420",
    breakdown: [
      { label: "Coin Unlocks", amount: "$12,480", colorKey: "coinUnlocks" },
      { label: "Memberships", amount: "$3,200", colorKey: "memberships" },
      { label: "Pending Payout", amount: "$1,840", colorKey: "pending" },
      { label: "Extras", amount: "$640", colorKey: "extras" },
    ],
  },
  earningsOverTime: [
    { month: "Jul", amount: 2800 },
    { month: "Aug", amount: 3200 },
    { month: "Sep", amount: 3600 },
    { month: "Oct", amount: 4100 },
    { month: "Nov", amount: 4800 },
    { month: "Dec", amount: 5200 },
    { month: "Jan", amount: 4900 },
    { month: "Feb", amount: 5500 },
    { month: "Mar", amount: 5800 },
  ],
  revenueBreakdown: [
    {
      id: "subscriptions",
      label: "Subscriptions",
      amount: "$12,400",
      percent: 42,
      icon: CreditCard,
    },
    {
      id: "coins",
      label: "Coin Purchases",
      amount: "$8,200",
      percent: 28,
      icon: Coins,
    },
    {
      id: "tips",
      label: "Tips & Gifts",
      amount: "$5,100",
      percent: 17,
      icon: Gift,
    },
    {
      id: "ads",
      label: "Ad Revenue",
      amount: "$3,800",
      percent: 13,
      icon: Tv,
    },
  ],
  earnMoreCards: MOCK_DASHBOARD_HOME.earnMoreCards,
  recentPayouts: [
    {
      id: "payout-1",
      bankLabel: "Payout to GTBank ••4521",
      date: "Jan 01",
      amount: "$2500.00",
    },
    {
      id: "payout-2",
      bankLabel: "Payout to Access Bank ••8903",
      date: "Feb 02",
      amount: "$1800.00",
    },
  ],
  bankAccounts: [
    {
      id: "bank-1",
      bankName: "GTBank",
      last4: "4521",
      holderName: "Adekunle Ciroma",
      isPrimary: true,
    },
    {
      id: "bank-2",
      bankName: "Access Bank",
      last4: "8903",
      holderName: "Adekunle Ciroma",
      isPrimary: false,
    },
  ],
  analyticsKpis: [
    {
      label: "Total Earnings",
      value: "$29,500",
      changePercent: 18.2,
      icon: "dollar",
    },
    {
      label: "This Month",
      value: "$3,800",
      changePercent: -1.2,
      icon: "chart",
    },
    {
      label: "Pending Payout",
      value: "$3,800",
      footnote: "Next: Apr 1",
      icon: "clock",
    },
    {
      label: "Top Source",
      value: "Coin Unlocks",
      changePercent: 44.7,
      icon: "creditCard",
    },
  ],
  revenueBySource: [
    {
      label: "Coin Unlocks",
      amount: "$12,480",
      percent: 68,
      colorKey: "coinUnlocks",
    },
    {
      label: "Memberships",
      amount: "$3,200",
      percent: 17,
      colorKey: "memberships",
    },
    { label: "Tips", amount: "$1,840", percent: 10, colorKey: "pending" },
    { label: "Extras", amount: "$640", percent: 3, colorKey: "extras" },
    {
      label: "Commission",
      amount: "$260",
      percent: 1,
      colorKey: "commission",
    },
  ],
  payoutSchedule: {
    frequency: "monthly",
    isActive: true,
    nextPayoutAmount: "$1,240.00",
    nextPayoutDate: "April 1, 2026",
  },
  notifications: [
    {
      id: "payout-processed",
      label: "Payout processed",
      description: "When your scheduled payout has been sent",
      enabled: true,
    },
    {
      id: "coin-purchases",
      label: "New coin purchases",
      description: "When viewers buy coins on your gated content",
      enabled: false,
    },
    {
      id: "milestone",
      label: "Revenue milestone reached",
      description: "Celebrate when you hit earning milestones",
      enabled: true,
    },
  ],
}
