import type { CreatorRevenueDashboard } from "@sable/contracts"
import { Coins, CreditCard, Gift, Tv } from "lucide-react"
import type { RevenueDashboardData } from "../types"

function formatMinor(amountMinor: number, currency: string): string {
  const major = amountMinor / 100
  if (currency === "NGN") {
    return `₦${major.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }
  return `$${major.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function mapRevenueDashboard(
  data: CreatorRevenueDashboard
): RevenueDashboardData {
  const currency = data.wallet.currency
  const availableLabel = formatMinor(data.wallet.available_minor, currency)
  const pendingLabel = formatMinor(data.wallet.pending_minor, currency)

  const giftTotal = data.wallet_activity
    .filter((item) => item.label.toLowerCase().includes("gift"))
    .reduce((sum, item) => sum + item.amount_minor, 0)
  const unlockTotal = data.wallet_activity
    .filter((item) => item.label.toLowerCase().includes("unlock"))
    .reduce((sum, item) => sum + item.amount_minor, 0)
  const totalTracked = giftTotal + unlockTotal || 1

  return {
    wallet: {
      balance: availableLabel,
      statusText:
        data.wallet.pending_minor > 0
          ? `${pendingLabel} pending (${data.wallet.hold_period_days}d hold)`
          : "Available now",
      nextAutoPayout: data.wallet.next_auto_payout_at
        ? formatShortDate(data.wallet.next_auto_payout_at)
        : "—",
      autoPayoutEnabled: data.wallet.auto_payout_enabled,
      availableMinor: data.wallet.available_minor,
      pendingMinor: data.wallet.pending_minor,
      minimumPayoutMinor: data.wallet.minimum_payout_minor,
      currency: data.wallet.currency,
    },
    walletActivity: data.wallet_activity.map((item) => ({
      id: item.id,
      type: item.type,
      label: item.label,
      date: formatShortDate(item.created_at),
      amount: `${item.type === "credit" ? "+" : "-"}${formatMinor(item.amount_minor, currency)}`,
    })),
    earningsOverTime: data.earnings_over_time.map((point) => ({
      month: point.month,
      amount: Math.round(point.amount_minor / 100),
    })),
    revenueBreakdown: [
      {
        id: "coins",
        label: "Coin Unlocks",
        amount: formatMinor(unlockTotal, currency),
        percent: Math.round((unlockTotal / totalTracked) * 100),
        icon: Coins,
      },
      {
        id: "tips",
        label: "Tips & Gifts",
        amount: formatMinor(giftTotal, currency),
        percent: Math.round((giftTotal / totalTracked) * 100),
        icon: Gift,
      },
      {
        id: "subscriptions",
        label: "Subscriptions",
        amount: formatMinor(0, currency),
        percent: 0,
        icon: CreditCard,
      },
      {
        id: "ads",
        label: "Ad Revenue",
        amount: formatMinor(0, currency),
        percent: 0,
        icon: Tv,
      },
    ],
    recentPayouts: data.recent_payouts.map((payout) => ({
      id: payout.id,
      bankName: payout.bank_name,
      last4: payout.last4,
      date: formatLongDate(payout.created_at),
      amount: formatMinor(payout.amount_minor, currency),
      status:
        payout.status === "paid"
          ? "completed"
          : payout.status === "failed"
            ? "failed"
            : "pending",
    })),
    bankAccounts: data.bank_accounts.map((account) => ({
      id: account.id,
      bankName: account.bank_name,
      last4: account.last4,
      holderName: account.holder_name,
      isPrimary: account.is_primary,
    })),
    analyticsKpis: [
      {
        label: "Available balance",
        value: availableLabel,
        icon: "dollar" as const,
      },
      {
        label: "Pending (hold)",
        value: pendingLabel,
        footnote: `${data.creator_share_percent}% creator share`,
        icon: "clock" as const,
      },
      {
        label: "Minimum payout",
        value: formatMinor(data.wallet.minimum_payout_minor, currency),
        icon: "creditCard" as const,
      },
      {
        label: "Recent activity",
        value: String(data.wallet_activity.length),
        icon: "chart" as const,
      },
    ],
    revenueBySource: [
      {
        label: "Coin Unlocks",
        amount: formatMinor(unlockTotal, currency),
        percent: Math.round((unlockTotal / totalTracked) * 100),
        colorKey: "coinUnlocks",
      },
      {
        label: "Tips",
        amount: formatMinor(giftTotal, currency),
        percent: Math.round((giftTotal / totalTracked) * 100),
        colorKey: "pending",
      },
    ],
    payoutSchedule: {
      frequency: "monthly",
      isActive: data.wallet.auto_payout_enabled,
      nextPayoutAmount: availableLabel,
      nextPayoutDate: data.wallet.next_auto_payout_at
        ? formatLongDate(data.wallet.next_auto_payout_at)
        : "Manual withdrawals",
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
}
