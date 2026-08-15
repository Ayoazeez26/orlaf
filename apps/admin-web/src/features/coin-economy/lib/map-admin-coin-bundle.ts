import type { AdminCoinBundle } from "@sable/contracts"
import type { CoinBundle } from "../types"

function parsePriceNumber(priceLabel: string) {
  return Number.parseFloat(priceLabel.replace(/[^\d.]/g, "")) || 1
}

export function mapAdminCoinBundle(bundle: AdminCoinBundle): CoinBundle {
  const totalCoins = bundle.coins + bundle.bonusCoins
  const priceNumber = parsePriceNumber(bundle.priceLabel)

  return {
    id: bundle.id,
    productId: bundle.productId,
    name: bundle.name,
    coins: bundle.coins,
    bonusCoins: bundle.bonusCoins,
    price: bundle.priceLabel,
    effectiveRate: Math.round(totalCoins / priceNumber),
    status: bundle.isLive ? "live" : "draft",
  }
}

export function mapAdminCoinBundles(items: AdminCoinBundle[]): CoinBundle[] {
  const bundles = items.map(mapAdminCoinBundle)
  const live = bundles.filter((bundle) => bundle.status === "live")
  if (live.length === 0) return bundles

  const best = live.reduce((current, candidate) =>
    candidate.effectiveRate > current.effectiveRate ? candidate : current
  )

  return bundles.map((bundle) => ({
    ...bundle,
    isBestValue: bundle.id === best.id && bundle.status === "live",
  }))
}

export function bundleFormToCreateRequest(values: {
  productId: string
  name: string
  coins: number
  bonusCoins: number
  price: string
  isLive: boolean
}) {
  return {
    productId: values.productId.trim(),
    name: values.name.trim(),
    coins: values.coins,
    bonusCoins: values.bonusCoins,
    priceLabel: values.price.trim(),
    isLive: values.isLive,
  }
}

export function bundleFormToUpdateRequest(values: {
  productId: string
  name: string
  coins: number
  bonusCoins: number
  price: string
  isLive: boolean
}) {
  return {
    productId: values.productId.trim(),
    name: values.name.trim(),
    coins: values.coins,
    bonusCoins: values.bonusCoins,
    priceLabel: values.price.trim(),
    isLive: values.isLive,
  }
}
