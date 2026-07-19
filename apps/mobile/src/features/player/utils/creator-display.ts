import type { PublicSeries } from "../../../services/catalog-api"

export function getCreatorDisplay(series: PublicSeries | undefined) {
  const name =
    series?.creator.creatorProfile?.studioName ??
    series?.creator.displayName ??
    ""

  return {
    creatorId: series?.creatorId ?? "",
    name,
    initials: name.slice(0, 2).toUpperCase() || "SB",
  }
}
