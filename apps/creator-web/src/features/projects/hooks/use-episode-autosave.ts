import { useEffect, useRef } from "react"
import { updateEpisode } from "../api/studio-api"
import type { EpisodeAccess, UploadEpisodeDraft } from "../types"

const AUTOSAVE_DEBOUNCE_MS = 2000

function mapEpisodeAccess(access: EpisodeAccess) {
  switch (access) {
    case "coins":
      return "coin_gated" as const
    case "premium":
      return "premium" as const
    default:
      return "free" as const
  }
}

interface SyncedFields {
  title: string
  synopsis: string
  access: EpisodeAccess
}

function hasChanged(episode: UploadEpisodeDraft, synced?: SyncedFields) {
  if (!synced) return true
  return (
    episode.title !== synced.title ||
    episode.synopsis !== synced.synopsis ||
    episode.access !== synced.access
  )
}

/**
 * Persists episode title/synopsis/access edits to the backend automatically,
 * debounced per episode so rapid keystrokes don't fire a request each time.
 */
export function useEpisodeAutosave(
  episodes: UploadEpisodeDraft[],
  seriesId: string | null
) {
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>())
  const syncedRef = useRef(new Map<string, SyncedFields>())

  useEffect(() => {
    const timers = timersRef.current
    const synced = syncedRef.current
    const liveEpisodeIds = new Set(episodes.map((ep) => ep.id))

    for (const episode of episodes) {
      const backendEpisodeId = episode.backendEpisodeId
      if (!seriesId || !backendEpisodeId) continue

      const baseline = synced.get(episode.id)
      if (!baseline) {
        // First time we see this episode with a backend id (freshly created,
        // or prefilled from an existing series) — treat current values as
        // already in sync rather than firing a redundant request.
        synced.set(episode.id, {
          title: episode.title,
          synopsis: episode.synopsis,
          access: episode.access,
        })
        continue
      }

      if (!hasChanged(episode, baseline)) continue

      timers.get(episode.id) && clearTimeout(timers.get(episode.id))

      const fields: SyncedFields = {
        title: episode.title,
        synopsis: episode.synopsis,
        access: episode.access,
      }

      const timer = setTimeout(() => {
        timers.delete(episode.id)
        synced.set(episode.id, fields)
        updateEpisode(seriesId, backendEpisodeId, {
          title: fields.title.trim() || "Untitled episode",
          synopsis: fields.synopsis.trim() || undefined,
          accessType: mapEpisodeAccess(fields.access),
        }).catch(() => {
          // Best effort autosave; the user can still continue/publish, which
          // will surface failures explicitly.
        })
      }, AUTOSAVE_DEBOUNCE_MS)

      timers.set(episode.id, timer)
    }

    for (const id of [...timers.keys()]) {
      if (!liveEpisodeIds.has(id)) {
        clearTimeout(timers.get(id))
        timers.delete(id)
        synced.delete(id)
      }
    }
  }, [episodes, seriesId])

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      for (const timer of timers.values()) clearTimeout(timer)
      timers.clear()
    }
  }, [])
}
