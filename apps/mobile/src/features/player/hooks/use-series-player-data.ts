import { useMemo, useState } from "react"
import { useGetEpisodeById, useGetSeriesById } from "../../../hooks/use-feed"
import type { SeriesEpisodeSummary } from "../../../services/catalog-api"
import { PLAYER_FALLBACK_URL } from "../constants"

export function useSeriesPlayerData(seriesId: string) {
  const {
    data: series,
    isLoading: seriesLoading,
    isError: seriesError,
  } = useGetSeriesById(seriesId)

  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null)

  const { data: episodeDetail, isLoading: episodeLoading } = useGetEpisodeById(
    seriesId,
    selectedEpisodeId ?? ""
  )

  const episodes = series?.episodes ?? []

  const selectedEpisode = useMemo(
    () => episodes.find((episode) => episode.id === selectedEpisodeId) ?? null,
    [episodes, selectedEpisodeId]
  )

  const selectedEpisodeIndex = selectedEpisode
    ? episodes.findIndex((episode) => episode.id === selectedEpisode.id) + 1
    : null

  const playbackUrl = useMemo(() => {
    if (!series) return null

    if (selectedEpisodeId) {
      if (episodeLoading) return null
      return episodeDetail?.hlsUrl ?? null
    }

    return series.trailerUrl ?? PLAYER_FALLBACK_URL
  }, [
    episodeDetail?.hlsUrl,
    episodeLoading,
    selectedEpisodeId,
    series,
    series?.trailerUrl,
  ])

  const playbackLabel = selectedEpisode?.title ?? series?.title ?? "Sable"
  const playbackSubtitle =
    series?.creator.creatorProfile?.studioName ??
    series?.creator.displayName ??
    undefined

  const posterSource = series?.posterUrl
    ? { uri: series.posterUrl }
    : undefined

  const freeEpisodeCount = episodes.filter(
    (episode) => episode.accessType === "free"
  ).length

  return {
    series,
    seriesLoading,
    seriesError,
    episodes,
    selectedEpisodeId,
    setSelectedEpisodeId,
    selectedEpisode,
    selectedEpisodeIndex,
    episodeDetail,
    episodeLoading,
    playbackUrl,
    playbackLabel,
    playbackSubtitle,
    posterSource,
    freeEpisodeCount,
  }
}

export type SeriesPlayerEpisode = SeriesEpisodeSummary
