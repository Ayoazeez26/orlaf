import type {
  WatchlistListResponse,
  WatchlistStatusResponse,
} from "@sable/contracts"
import { apiRequest } from "../lib/http-client"

const BASE = "/api/v1/library/watchlist"

export function fetchWatchlist(): Promise<WatchlistListResponse> {
  return apiRequest<WatchlistListResponse>(BASE)
}

export function fetchWatchlistStatus(
  seriesId: string
): Promise<WatchlistStatusResponse> {
  return apiRequest<WatchlistStatusResponse>(`${BASE}/${seriesId}/status`)
}

export function addToWatchlist(seriesId: string): Promise<void> {
  return apiRequest<void>(`${BASE}/${seriesId}`, { method: "POST" })
}

export function removeFromWatchlist(seriesId: string): Promise<void> {
  return apiRequest<void>(`${BASE}/${seriesId}`, { method: "DELETE" })
}

export function clearWatchlist(): Promise<void> {
  return apiRequest<void>(BASE, { method: "DELETE" })
}
