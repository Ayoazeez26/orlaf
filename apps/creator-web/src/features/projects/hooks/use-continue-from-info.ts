import { useCallback, useState } from "react"
import { attachSeriesToTrailerUpload } from "@/features/uploads/upload-runner"
import { toastMutationError } from "@/lib/toast"
import { createSeries, updateSeries } from "../api/studio-api"
import { buildSeriesPayload } from "../lib/map-wizard-series-payload"
import type { UploadWizardState } from "../types"
import { useUploadWizard } from "../upload/upload-wizard-context"

export function useContinueFromInfo() {
  const { state, dispatch, wizardId } = useUploadWizard()
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
        // The trailer may still be uploading or processing; link it so it
        // lands on the series whenever it finishes.
        await attachSeriesToTrailerUpload(series.id, wizardId).catch(
          () => undefined
        )
      }

      return true
    } catch (error) {
      toastMutationError(error, "Failed to save series")
      return false
    } finally {
      setIsContinuing(false)
      dispatch({ type: "SET_FIELD", payload: { isContinuing: false } })
    }
  }, [dispatch, state, wizardId])

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
