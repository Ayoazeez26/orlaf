const unlockedEpisodeIds = new Set<number | string>()
let lastUnlockedEpisode: number | null | string = null

function unlockEpisode(episodeId: number | string) {
  unlockedEpisodeIds.add(episodeId)
  lastUnlockedEpisode = episodeId
}

export function unlockEpisodeViaAd(episodeId: number) {
  unlockEpisode(episodeId)
}

export function unlockEpisodeViaCoins(episodeId: number) {
  unlockEpisode(episodeId)
}

export function isEpisodeUnlockedInSession(episodeId: number | string) {
  return unlockedEpisodeIds.has(episodeId)
}

/** @deprecated Use isEpisodeUnlockedInSession */
export function isEpisodeUnlockedViaAd(episodeId: number | string) {
  return isEpisodeUnlockedInSession(episodeId)
}

export function consumeLastUnlockedEpisode() {
  const episode = lastUnlockedEpisode
  lastUnlockedEpisode = null
  return episode
}

/** @deprecated Use consumeLastUnlockedEpisode */
export function consumeLastAdUnlockedEpisode() {
  return consumeLastUnlockedEpisode()
}
