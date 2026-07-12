import type { CoinBundle } from "../types"

export const MOCK_COIN_BUNDLES: CoinBundle[] = [
  {
    id: "starter",
    name: "Starter",
    coins: 100,
    bonusCoins: 0,
    price: "₦9.99",
    effectiveRate: 101,
    status: "live",
  },
  {
    id: "popular",
    name: "Popular",
    coins: 550,
    bonusCoins: 50,
    price: "$4.99",
    effectiveRate: 120,
    status: "live",
  },
  {
    id: "best-value",
    name: "Best Value",
    coins: 1200,
    bonusCoins: 200,
    price: "₦9.99",
    effectiveRate: 140,
    status: "live",
    isBestValue: true,
  },
  {
    id: "whale",
    name: "Whale",
    coins: 7000,
    bonusCoins: 2000,
    price: "$49.99",
    effectiveRate: 180,
    status: "live",
  },
]
