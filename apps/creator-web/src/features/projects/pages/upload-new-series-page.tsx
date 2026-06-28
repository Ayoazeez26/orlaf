import { useQuery } from "@tanstack/react-query"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useEffect, useRef } from "react"
import { getSeries } from "../api/studio-api"
import { BackToProjectsLink } from "../components/shared/back-to-projects-link"
import { UploadEpisodesStep } from "../components/upload/upload-episodes-step"
import { UploadReviewStep } from "../components/upload/upload-review-step"
import { UploadSeriesInfoStep } from "../components/upload/upload-series-info-step"
import { UploadStepper } from "../components/upload/upload-stepper"
import { mapSeriesToWizardFields } from "../lib/map-series-to-wizard-state"
import type { UploadWizardState } from "../types"
import {
  UploadWizardProvider,
  useUploadWizard,
} from "../upload/upload-wizard-context"

type UploadSearch = {
  step?: UploadWizardState["step"]
  seriesId?: string
  addEpisode?: boolean
}

function UploadNewSeriesContent() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as UploadSearch
  const { state, dispatch } = useUploadWizard()
  const seriesId = search.seriesId
  const prefilledSeriesId = useRef<string | null>(null)

  const seriesQuery = useQuery({
    queryKey: ["studio", "series", seriesId],
    queryFn: () => getSeries(seriesId as string),
    enabled: Boolean(seriesId),
  })

  useEffect(() => {
    if (!seriesQuery.data || prefilledSeriesId.current === seriesId) return
    prefilledSeriesId.current = seriesId ?? null

    dispatch({
      type: "SET_FIELD",
      payload: mapSeriesToWizardFields(seriesQuery.data),
    })

    if (search.addEpisode) {
      dispatch({ type: "ADD_EPISODES", payload: 1 })
    }
  }, [seriesQuery.data, seriesId, search.addEpisode, dispatch])

  const step = search.step ?? state.step
  const isEditing = Boolean(seriesId)

  function goToStep(next: UploadWizardState["step"]) {
    dispatch({ type: "SET_STEP", payload: next })
    navigate({
      to: "/dashboard/projects/new",
      search: { step: next, seriesId },
    })
  }

  if (seriesId && seriesQuery.isError) {
    return (
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <BackToProjectsLink projectId={seriesId} />
        <p className="text-destructive text-sm">Could not load this series.</p>
      </div>
    )
  }

  if (seriesId && prefilledSeriesId.current !== seriesId) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <div className="space-y-4">
        <BackToProjectsLink projectId={seriesId} />
        <div>
          <h1 className="font-semibold text-2xl text-foreground">
            {isEditing ? "Edit Series" : "Upload New Series"}
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            {isEditing
              ? "Update your series details and episodes"
              : "Set up your series and add episodes"}
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
          initialExpandedEpisodeId={
            search.addEpisode
              ? state.episodes[state.episodes.length - 1]?.id
              : undefined
          }
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
