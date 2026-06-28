import { createFileRoute } from "@tanstack/react-router"
import { UploadNewSeriesPage } from "@/features/projects/pages/upload-new-series-page"
import type { UploadWizardState } from "@/features/projects/types"

type UploadSearch = {
  step?: UploadWizardState["step"]
  seriesId?: string
  addEpisode?: boolean
}

export const Route = createFileRoute("/dashboard/projects/new")({
  validateSearch: (search: Record<string, unknown>): UploadSearch => ({
    step:
      search.step === "info" ||
      search.step === "episodes" ||
      search.step === "review"
        ? search.step
        : "info",
    seriesId: typeof search.seriesId === "string" ? search.seriesId : undefined,
    addEpisode: search.addEpisode === true || search.addEpisode === "true",
  }),
  component: UploadNewSeriesPage,
})
