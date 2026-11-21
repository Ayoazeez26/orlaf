import { useQuery } from "@tanstack/react-query"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Save } from "lucide-react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { usePreferences } from "@/features/settings/hooks/use-preferences"
import { getSeries } from "../api/studio-api"
import { BackToProjectsLink } from "../components/shared/back-to-projects-link"
import { UploadEpisodesStep } from "../components/upload/upload-episodes-step"
import { UploadReviewStep } from "../components/upload/upload-review-step"
import { UploadSeriesInfoStep } from "../components/upload/upload-series-info-step"
import { UploadStepper } from "../components/upload/upload-stepper"
import { useSaveUploadDraft } from "../hooks/use-save-upload-draft"
import { mapCreatorContentDefaults } from "../lib/map-creator-content-defaults"
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
  const saveDraft = useSaveUploadDraft()
  const { data: preferences, isLoading: preferencesLoading } = usePreferences()
  const seriesId = search.seriesId
  const prefilledSeriesId = useRef<string | null>(null)
  const appliedCreatorDefaults = useRef(false)

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

    // A short film holds exactly one video — never add a second slot.
    if (search.addEpisode && seriesQuery.data.type !== "short_film") {
      dispatch({ type: "ADD_EPISODES", payload: 1 })
    }
  }, [seriesQuery.data, seriesId, search.addEpisode, dispatch])

  useLayoutEffect(() => {
    if (seriesId || appliedCreatorDefaults.current || !preferences) return
    appliedCreatorDefaults.current = true
    dispatch({
      type: "SET_FIELD",
      payload: mapCreatorContentDefaults(preferences),
    })
  }, [seriesId, preferences, dispatch])

  const step = search.step ?? state.step
  // Fixed at mount: a new project gains a seriesId once its draft is saved,
  // but it is still being created, not edited.
  const [isEditing] = useState(() => Boolean(search.seriesId))
  const projectNoun = state.projectType === "short-film" ? "film" : "series"

  // The draft series is created mid-step (e.g. when the trailer is picked).
  // Put its id in the URL right away so a reload restores it from the
  // backend instead of starting a second, empty project.
  const latestSeriesId = useRef(state.seriesId)
  latestSeriesId.current = state.seriesId
  useEffect(() => {
    if (!state.seriesId || seriesId) return
    prefilledSeriesId.current = state.seriesId
    navigate({
      to: "/dashboard/projects/new",
      search: { step, seriesId: state.seriesId },
      replace: true,
    })
  }, [state.seriesId, seriesId, step, navigate])

  function goToStep(next: UploadWizardState["step"]) {
    // Read the id through a ref: Continue creates or saves the series and
    // then calls this from a closure made before that render.
    const nextSeriesId = seriesId ?? latestSeriesId.current ?? undefined
    // The wizard already holds this series' data; don't refetch over it.
    if (nextSeriesId) prefilledSeriesId.current = nextSeriesId
    dispatch({ type: "SET_STEP", payload: next })
    navigate({
      to: "/dashboard/projects/new",
      search: { step: next, seriesId: nextSeriesId },
    })
  }

  if (!seriesId && preferencesLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      </div>
    )
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
        <div className="flex flex-wrap items-start justify-between gap-3">
          <BackToProjectsLink projectId={seriesId} />
          <Button
            variant="outline"
            size="sm"
            onClick={saveDraft}
            className="shrink-0"
          >
            <Save className="size-4" aria-hidden />
            Save draft
          </Button>
        </div>
        <div>
          <h1 className="font-semibold text-2xl text-foreground">
            {isEditing ? "Edit Project" : "Upload New Project"}
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            {isEditing
              ? `Update your ${projectNoun} details and publish changes to Sable.`
              : `Set up your ${projectNoun} and publish it to Sable.`}
          </p>
        </div>
        <UploadStepper currentStep={step} projectType={state.projectType} />
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
