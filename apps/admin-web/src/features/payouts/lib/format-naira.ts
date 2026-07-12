export function formatNaira(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000
    return `₦${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`
  }

  return `₦${amount.toLocaleString("en-NG")}`
}
