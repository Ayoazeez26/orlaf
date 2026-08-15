/** Placeholder conversion until coin economy is wired. Creators see this as a hint only. */
export const COINS_PER_USD = 10

export function formatCoinUsdHint(coins: number): string {
  const usd = coins / COINS_PER_USD
  return `${coins} coin${coins === 1 ? "" : "s"} = $${usd.toFixed(2)}`
}

export function formatCoinAccessLabel(coins?: number | null): string {
  if (coins == null || !Number.isFinite(coins) || coins < 1) return "Coins"
  return `${coins} ${coins === 1 ? "Coin" : "Coins"}`
}

export function parseCoinPriceInput(value: string): number | undefined {
  const digits = value.replace(/\D/g, "")
  if (!digits) return undefined
  const parsed = Number.parseInt(digits, 10)
  if (!Number.isFinite(parsed) || parsed < 1) return undefined
  return parsed
}
