import type { AdminCoinPurchase } from "@sable/contracts"
import type { CoinPurchase } from "../types"

export function mapAdminPurchase(item: AdminCoinPurchase): CoinPurchase {
  return {
    id: item.id,
    receipt: item.receipt,
    userName: item.user_name,
    userEmail: item.user_email,
    bundleLabel: item.bundle_label,
    coins: item.coins,
    amount: item.amount_label,
    method: item.method,
    status: item.status,
    date: formatPurchaseDate(item.created_at),
  }
}

function formatPurchaseDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export function formatCoinCount(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }
  return value.toLocaleString("en-US")
}
