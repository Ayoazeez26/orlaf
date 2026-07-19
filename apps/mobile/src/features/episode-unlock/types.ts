export const AD_UNLOCK_DURATION_SECONDS = 15

export const COIN_PACKAGES = [
  { id: "60", coins: 60, price: "$0.99" },
  { id: "180", coins: 180, price: "$2.99", popular: true, bonus: "+10%" },
  { id: "400", coins: 400, price: "$5.99", bonus: "+25%" },
  { id: "1000", coins: 1000, price: "$12.99", bonus: "+40%" },
] as const

export type CoinPackage = (typeof COIN_PACKAGES)[number]

export const DEFAULT_COIN_PACKAGE_ID = "180"

export const MOCK_COIN_BALANCE = 10
