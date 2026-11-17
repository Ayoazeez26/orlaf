import type { UploadEpisodeDraft } from "../types"

/** Slot added with +N / Add Episode that was never uploaded. */
export function isEmptyEpisodeSlot(episode: UploadEpisodeDraft): boolean {
  return !episode.backendEpisodeId && episode.media == null
}

export function episodesRequiringVideo(episodes: UploadEpisodeDraft[]) {
  return episodes.filter((episode) => !isEmptyEpisodeSlot(episode))
}

/** Statuses where the video is on its way — the creator can move on. */
const IN_FLIGHT_STATUSES = new Set([
  "queued",
  "converting",
  "uploading",
  "paused",
  "processing",
  "ready",
])

/** Statuses where the browser is still sending the file. */
const SENDING_STATUSES = new Set([
  "probing",
  "queued",
  "converting",
  "uploading",
  "paused",
])

export function isEpisodeVideoSending(episode: UploadEpisodeDraft) {
  return SENDING_STATUSES.has(episode.media?.status ?? "")
}

/**
 * Why the series can't be submitted yet, or null. Uploads must have finished
 * sending (the tab is doing that work); Cloudflare processing may still be
 * running — the server submits once it finishes.
 */
export function getSubmitBlocker(state: {
  episodes: UploadEpisodeDraft[]
  trailer: { status: string } | null
}): string | null {
  const required = episodesRequiringVideo(state.episodes)
  if (required.some((episode) => episode.media?.status === "failed")) {
    return "Fix failed episode uploads before submitting."
  }
  if (state.trailer?.status === "failed") {
    return "Fix the failed trailer upload before submitting."
  }
  const sending =
    required.filter(isEpisodeVideoSending).length +
    (state.trailer && SENDING_STATUSES.has(state.trailer.status) ? 1 : 0)
  if (sending > 0) {
    return sending === 1
      ? "Waiting for 1 upload to finish…"
      : `Waiting for ${sending} uploads to finish…`
  }
  if (required.some((episode) => !episode.media)) {
    return "Every episode needs a video. Remove unused slots to submit."
  }
  return null
}

export function getEpisodesStepBlocker(
  episodes: UploadEpisodeDraft[]
): string | null {
  const required = episodesRequiringVideo(episodes)

  if (required.length === 0) {
    return "Upload at least one episode to continue."
  }

  // Uploads keep running in the background, so only problems block.
  if (required.some((episode) => episode.media?.status === "failed")) {
    return "Fix failed episode uploads before continuing."
  }
  if (required.some((episode) => episode.media?.status === "probing")) {
    return "Checking your video…"
  }
  if (
    required.some(
      (episode) => !IN_FLIGHT_STATUSES.has(episode.media?.status ?? "")
    )
  ) {
    return "Every episode needs a video. Remove unused slots to continue."
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
