import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toastMutationError } from "@/lib/toast"
import { updateSeries } from "../api/studio-api"
import { projectKeys } from "../data/query-keys"
import { buildSeriesUpdatePayload } from "../lib/map-wizard-series-payload"
import { useUploadWizard } from "../upload/upload-wizard-context"

export function useSaveUploadDraft() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { state, dispatch, ensureSeriesId } = useUploadWizard()

  return async () => {
    // Save what's been entered onto the draft. A wizard with nothing in it
    // yet has nothing worth keeping, so it just closes.
    const hasContent = Boolean(state.seriesId || state.title.trim())
    if (hasContent) {
      try {
        const seriesId = await ensureSeriesId()
        await updateSeries(seriesId, buildSeriesUpdatePayload(state))
      } catch (error) {
        toastMutationError(error, "Couldn't save your draft. Try again.")
        return
      }
    }
    queryClient.invalidateQueries({ queryKey: projectKeys.list() })
    dispatch({ type: "RESET" })
    navigate({ to: "/dashboard/projects" })
  }
}
