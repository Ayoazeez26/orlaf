export function formatRelativeUpdatedAt(dateMs: number): string {
  const diffMs = Math.max(0, Date.now() - dateMs)
  const minutes = Math.floor(diffMs / 60_000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return "just now"
}
