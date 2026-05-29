import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { projectKeys } from "../data/query-keys"
import { useUploadWizard } from "../upload/upload-wizard-context"

export function useSaveUploadDraft() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { dispatch } = useUploadWizard()

  return () => {
    queryClient.invalidateQueries({ queryKey: projectKeys.list() })
    dispatch({ type: "RESET" })
    navigate({ to: "/dashboard/projects" })
  }
}
