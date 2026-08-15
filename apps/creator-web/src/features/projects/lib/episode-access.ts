import {
  DEFAULT_EPISODE_COIN_PRICE,
  EpisodeAccessType,
} from "@sable/contracts"
import type { EpisodeAccess } from "../types"

export function mapEpisodeAccessToApi(access: EpisodeAccess): EpisodeAccessType {
  switch (access) {
    case "coins":
      return EpisodeAccessType.COIN_GATED
    case "premium":
      return EpisodeAccessType.PREMIUM
    default:
      return EpisodeAccessType.FREE
  }
}

export function resolveEpisodeCoinPrice(
  access: EpisodeAccess,
  coinPrice: number | null | undefined
): number {
  if (access !== "coins") return DEFAULT_EPISODE_COIN_PRICE
  if (
    typeof coinPrice === "number" &&
    Number.isInteger(coinPrice) &&
    coinPrice > 0
  ) {
    return coinPrice
  }
  return DEFAULT_EPISODE_COIN_PRICE
}

export function buildEpisodeEconomyPayload(
  access: EpisodeAccess,
  coinPrice: number | null | undefined
) {
  const accessType = mapEpisodeAccessToApi(access)
  if (accessType !== EpisodeAccessType.COIN_GATED) {
    return { accessType }
  }

  return {
    accessType,
    coinPrice: resolveEpisodeCoinPrice(access, coinPrice),
  }
}

export function parseCoinPriceInput(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const parsed = Number.parseInt(trimmed, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return parsed
}
