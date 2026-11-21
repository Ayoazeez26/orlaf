import { useEffect, useRef } from "react"
import { updateSeries } from "../api/studio-api"
import { buildSeriesUpdatePayload } from "../lib/map-wizard-series-payload"
import type { UploadWizardState } from "../types"

const AUTOSAVE_DEBOUNCE_MS = 1500

/**
 * Saves the info step's details onto the draft series as the creator types,
 * once the draft exists. Debounced, and skipped when nothing changed since
 * the last save (or since the draft was loaded or created).
 */
export function useSeriesInfoAutosave(state: UploadWizardState) {
  const seriesId = state.seriesId
  const payload = seriesId ? buildSeriesUpdatePayload(state) : null
  const key = payload ? JSON.stringify(payload) : null
  const savedKey = useRef<{ seriesId: string; key: string } | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: `key` is `payload` serialized
  useEffect(() => {
    if (!seriesId || !payload || key == null) return
    // First sight of this series: its current details are the baseline.
    if (savedKey.current?.seriesId !== seriesId) {
      savedKey.current = { seriesId, key }
      return
    }
    if (savedKey.current.key === key) return

    const timer = setTimeout(() => {
      updateSeries(seriesId, payload)
        .then(() => {
          savedKey.current = { seriesId, key }
        })
        // Quiet: Continue saves everything again and reports failures.
        .catch(() => undefined)
    }, AUTOSAVE_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [seriesId, key])
}
