import type { UploadEpisodeDraft } from "../types"

/** Slot added with +N / Add Episode that was never uploaded. */
export function isEmptyEpisodeSlot(episode: UploadEpisodeDraft): boolean {
  return !episode.backendEpisodeId && episode.media == null
}

export function episodesRequiringVideo(episodes: UploadEpisodeDraft[]) {
  return episodes.filter((episode) => !isEmptyEpisodeSlot(episode))
}

export function getEpisodesStepBlocker(
  episodes: UploadEpisodeDraft[]
): string | null {
  const required = episodesRequiringVideo(episodes)

  if (required.length === 0) {
    return "Upload at least one episode to continue."
  }

  const notReady = required.filter(
    (episode) => episode.media?.status !== "ready"
  )
  if (notReady.length > 0) {
    const first = notReady[0]
    const status = first?.media?.status
    if (status === "processing") {
      return "Wait for episode processing to finish before continuing."
    }
    if (status === "uploading" || status === "converting") {
      return "Wait for uploads to finish before continuing."
    }
    if (status === "failed") {
      return "Fix failed episode uploads before continuing."
    }
    return "Every episode needs a finished video upload. Remove unused slots to continue."
  }

  const missingPrice = required.filter(
    (episode) =>
      episode.access === "coins" &&
      (episode.coinPrice == null || episode.coinPrice < 1)
  )
  if (missingPrice.length > 0) {
    return "Set coins to unlock on every coin-gated episode, or switch those episodes to Free."
  }

  return null
}
