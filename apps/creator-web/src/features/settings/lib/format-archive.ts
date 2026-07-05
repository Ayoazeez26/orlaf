export function formatArchivedAt(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso))
}

export function formatArchiveSize(sizeBytes: number | null) {
  if (sizeBytes == null || sizeBytes <= 0) return "—"

  const units = ["B", "KB", "MB", "GB", "TB"] as const
  let value = sizeBytes
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  const formatted =
    unitIndex === 0
      ? `${value}`
      : value >= 10
        ? value.toFixed(0)
        : value.toFixed(1)
  return `${formatted} ${units[unitIndex]}`
}

export function archiveTypeLabel(type: "project" | "episode" | "promotion") {
  if (type === "project") return "Project"
  if (type === "episode") return "Episode"
  return "Promotion"
}
