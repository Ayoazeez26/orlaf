import { createFileRoute } from "@tanstack/react-router"
import { UploadNewSeriesPage } from "@/features/projects/pages/upload-new-series-page"
import type { UploadWizardState } from "@/features/projects/types"

type UploadSearch = {
  step?: UploadWizardState["step"]
}

export const Route = createFileRoute("/dashboard/projects/new")({
  validateSearch: (search: Record<string, unknown>): UploadSearch => ({
    step:
      search.step === "info" ||
      search.step === "episodes" ||
      search.step === "review"
        ? search.step
        : "info",
  }),
  component: UploadNewSeriesPage,
})
