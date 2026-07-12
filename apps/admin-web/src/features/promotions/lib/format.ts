export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`
}

export function formatImpressions(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}k`
  }
  return String(count)
}
