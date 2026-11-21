import { useCallback, useState } from "react"
import { toastMutationError } from "@/lib/toast"
import { updateSeries } from "../api/studio-api"
import { buildSeriesUpdatePayload } from "../lib/map-wizard-series-payload"
import type { UploadWizardState } from "../types"
import { useUploadWizard } from "../upload/upload-wizard-context"

export function useContinueFromInfo() {
  const { state, dispatch, ensureSeriesId } = useUploadWizard()
  const [isContinuing, setIsContinuing] = useState(false)

  const continueFromInfo = useCallback(async (): Promise<boolean> => {
    dispatch({ type: "SET_FIELD", payload: { continueError: null } })
    setIsContinuing(true)
    dispatch({ type: "SET_FIELD", payload: { isContinuing: true } })

    try {
      // Normally the draft already exists (picking the trailer creates it);
      // either way, save everything entered so far onto it.
      const seriesId = await ensureSeriesId()
      await updateSeries(seriesId, buildSeriesUpdatePayload(state))

      return true
    } catch (error) {
      toastMutationError(error, "Failed to save series")
      return false
    } finally {
      setIsContinuing(false)
      dispatch({ type: "SET_FIELD", payload: { isContinuing: false } })
    }
  }, [dispatch, state, ensureSeriesId])

  return { continueFromInfo, isContinuing }
}

export function canContinueFromInfo(state: UploadWizardState): boolean {
  const posterReady =
    state.poster?.status === "ready" && Boolean(state.poster.remoteUrl)
  // The trailer only has to be on its way: it keeps uploading and processing
  // in the background and is attached to the series when it finishes.
  const trailerStarted =
    state.trailer != null &&
    state.trailer.status !== "failed" &&
    state.trailer.status !== "idle" &&
    state.trailer.status !== "probing"

  return (
    state.title.trim().length > 0 &&
    state.genres.length > 0 &&
    posterReady &&
    trailerStarted &&
    !state.isContinuing
  )
}
