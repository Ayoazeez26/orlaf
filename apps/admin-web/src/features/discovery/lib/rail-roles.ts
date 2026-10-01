import {
  CATALOG_COLLECTION_KEYS,
  type CatalogCollectionKey,
} from "@sable/contracts"
import type { DiscoveryRail } from "../types"

export type RailRole =
  | { kind: "tab"; key: CatalogCollectionKey }
  | { kind: "hero" }
  | { kind: "row"; index: number }
  | { kind: "extra-hero" }
  | { kind: "empty" }
  | { kind: "off" }

export const COLLECTION_TAB_LABEL: Record<CatalogCollectionKey, string> = {
  featured: "Featured",
  trending: "Trending",
  new: "New",
  popular: "Popular",
  "old-nollywood": "Old Nollywood",
  "ai-films": "AI Films",
  "sable-originals": "Sable Originals",
}

function isCollectionKey(value: string): value is CatalogCollectionKey {
  return (CATALOG_COLLECTION_KEYS as readonly string[]).includes(value)
}

/** Mirrors the backend: an explicit key, else a title naming the tab. */
export function railTabKey(
  rail: Pick<DiscoveryRail, "title" | "collectionKey">
): CatalogCollectionKey | null {
  if (rail.collectionKey && isCollectionKey(rail.collectionKey)) {
    return rail.collectionKey
  }
  const title = rail.title.trim().toLowerCase()
  return (
    CATALOG_COLLECTION_KEYS.find(
      (key) => key === title || key.replace(/-/g, " ") === title
    ) ?? null
  )
}

/** What each Home rail does in the app, keyed by rail id. */
export function homeRailRoles(rails: DiscoveryRail[]): Map<string, RailRole> {
  const roles = new Map<string, RailRole>()
  let heroTaken = false
  let rowIndex = 0

  const ordered = rails
    .filter((rail) => rail.surface === "home")
    .sort((a, b) => a.position - b.position)

  for (const rail of ordered) {
    const tabKey = railTabKey(rail)
    if (tabKey) {
      roles.set(rail.id, { kind: "tab", key: tabKey })
      continue
    }
    if (rail.status !== "live" || !rail.isVisible) {
      roles.set(rail.id, { kind: "off" })
      continue
    }
    if (rail.type === "hero") {
      roles.set(rail.id, heroTaken ? { kind: "extra-hero" } : { kind: "hero" })
      heroTaken = true
      continue
    }
    if (rail.items.length === 0) {
      roles.set(rail.id, { kind: "empty" })
      continue
    }
    rowIndex += 1
    roles.set(rail.id, { kind: "row", index: rowIndex })
  }

  return roles
}

export function railRoleLabel(role: RailRole): string {
  switch (role.kind) {
    case "tab":
      return `Replaces ${COLLECTION_TAB_LABEL[role.key]} tab`
    case "hero":
      return "Hero carousel"
    case "row":
      return `Featured row #${role.index}`
    case "extra-hero":
      return "Unused: only the first hero rail shows"
    case "empty":
      return "Shows once it has series"
    case "off":
      return "Not shown in the app"
  }
}
