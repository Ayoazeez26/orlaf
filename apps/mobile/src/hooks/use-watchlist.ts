import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "../context/auth-context"
import {
  addToWatchlist,
  clearWatchlist,
  fetchWatchlist,
  fetchWatchlistStatus,
  removeFromWatchlist,
} from "../services/library-api"

export const watchlistKeys = {
  all: ["watchlist"] as const,
  status: (seriesId: string) => ["watchlist", "status", seriesId] as const,
}

export function useWatchlist() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: watchlistKeys.all,
    queryFn: fetchWatchlist,
    enabled: isAuthenticated,
  })
}

export function useWatchlistStatus(seriesId: string) {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: watchlistKeys.status(seriesId),
    queryFn: () => fetchWatchlistStatus(seriesId),
    enabled: isAuthenticated && !!seriesId,
  })
}

export function useToggleWatchlist(seriesId: string) {
  const queryClient = useQueryClient()
  const { data: status } = useWatchlistStatus(seriesId)

  const addMutation = useMutation({
    mutationFn: () => addToWatchlist(seriesId),
    onSuccess: () => {
      queryClient.setQueryData(watchlistKeys.status(seriesId), { saved: true })
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all })
    },
  })

  const removeMutation = useMutation({
    mutationFn: () => removeFromWatchlist(seriesId),
    onSuccess: () => {
      queryClient.setQueryData(watchlistKeys.status(seriesId), { saved: false })
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all })
    },
  })

  const isSaved = status?.saved ?? false
  const isPending = addMutation.isPending || removeMutation.isPending

  const toggle = () => {
    if (isPending) return
    if (isSaved) {
      removeMutation.mutate()
    } else {
      addMutation.mutate()
    }
  }

  return { isSaved, isPending, toggle }
}

export function useClearWatchlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: clearWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all })
      queryClient.removeQueries({ queryKey: ["watchlist", "status"] })
    },
  })
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeFromWatchlist,
    onSuccess: (_data, seriesId) => {
      queryClient.setQueryData(watchlistKeys.status(seriesId), { saved: false })
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all })
    },
  })
}
