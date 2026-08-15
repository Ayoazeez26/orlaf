import { useCallback, useState } from "react"
import { toast, toastMutationError } from "@/lib/toast"
import { createSeries, updateSeries } from "../api/studio-api"
import { buildSeriesPayload } from "../lib/map-wizard-series-payload"
import type { UploadWizardState } from "../types"
import { useUploadWizard } from "../upload/upload-wizard-context"

export function useContinueFromInfo() {
  const { state, dispatch } = useUploadWizard()
  const [isContinuing, setIsContinuing] = useState(false)

  const continueFromInfo = useCallback(async (): Promise<boolean> => {
    dispatch({ type: "SET_FIELD", payload: { continueError: null } })
    setIsContinuing(true)
    dispatch({ type: "SET_FIELD", payload: { isContinuing: true } })

    try {
      const payload = buildSeriesPayload(state)

      if (state.seriesId) {
        await updateSeries(state.seriesId, payload)
      } else {
        const series = await createSeries(payload)
        dispatch({ type: "SET_SERIES_ID", payload: series.id })
      }

      return true
    } catch (error) {
      toastMutationError(error, "Failed to save series")
      return false
    } finally {
      setIsContinuing(false)
      dispatch({ type: "SET_FIELD", payload: { isContinuing: false } })
    }
  }, [dispatch, state])

  return { continueFromInfo, isContinuing }
}

export function canContinueFromInfo(state: UploadWizardState): boolean {
  const posterReady =
    state.poster?.status === "ready" && Boolean(state.poster.remoteUrl)
  const trailerReady =
    state.trailer?.status === "ready" && Boolean(state.trailerUrl)
  const posterBusy =
    state.poster != null &&
    state.poster.status !== "ready" &&
    state.poster.status !== "failed"
  const trailerBusy =
    state.trailer != null &&
    state.trailer.status !== "ready" &&
    state.trailer.status !== "failed"

  return (
    state.title.trim().length > 0 &&
    state.genres.length > 0 &&
    posterReady &&
    trailerReady &&
    !posterBusy &&
    !trailerBusy &&
    !state.isContinuing
  )
}
