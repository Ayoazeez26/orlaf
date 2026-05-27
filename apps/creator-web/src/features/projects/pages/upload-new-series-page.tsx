import { useNavigate, useSearch } from "@tanstack/react-router"
import { BackToProjectsLink } from "../components/shared/back-to-projects-link"
import { UploadEpisodesStep } from "../components/upload/upload-episodes-step"
import { UploadReviewStep } from "../components/upload/upload-review-step"
import { UploadSeriesInfoStep } from "../components/upload/upload-series-info-step"
import { UploadStepper } from "../components/upload/upload-stepper"
import type { UploadWizardState } from "../types"
import {
  UploadWizardProvider,
  useUploadWizard,
} from "../upload/upload-wizard-context"

type UploadSearch = {
  step?: UploadWizardState["step"]
}

function UploadNewSeriesContent() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as UploadSearch
  const { state, dispatch } = useUploadWizard()

  const step = search.step ?? state.step

  function goToStep(next: UploadWizardState["step"]) {
    if (next === "episodes" && !state.title.trim()) {
      dispatch({
        type: "SET_FIELD",
        payload: { title: "The Returnees", genre: state.genre || "Drama" },
      })
    }
    dispatch({ type: "SET_STEP", payload: next })
    navigate({
      to: "/dashboard/projects/new",
      search: { step: next },
    })
  }

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className="space-y-4">
        <BackToProjectsLink />
        <div>
          <h1 className="font-semibold text-2xl text-foreground">
            Upload New Series
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Set up your series and add episodes
          </p>
        </div>
        <UploadStepper currentStep={step} />
      </div>

      {step === "info" && (
        <UploadSeriesInfoStep onNext={() => goToStep("episodes")} />
      )}
      {step === "episodes" && (
        <UploadEpisodesStep
          onBack={() => goToStep("info")}
          onNext={() => goToStep("review")}
        />
      )}
      {step === "review" && (
        <UploadReviewStep onBack={() => goToStep("episodes")} />
      )}
    </div>
  )
}

export function UploadNewSeriesPage() {
  return (
    <UploadWizardProvider>
      <UploadNewSeriesContent />
    </UploadWizardProvider>
  )
}
