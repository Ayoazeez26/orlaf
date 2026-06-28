import type { CompleteOnboardingResponse } from "@sable/contracts"
import { useCallback, useState } from "react"
import { completeOnboarding, patchOnboarding } from "../api/onboarding-api"
import {
  toContentPatch,
  toCreatorTypePatch,
  toGetStartedPatch,
  toStudioPatch,
} from "../lib/onboarding-mappers"
import { useOnboarding } from "../onboarding-context"
import type { OnboardingData } from "../types"

export function useOnboardingPersist() {
  const { data } = useOnboarding()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async (fn: () => Promise<void>) => {
    setIsSaving(true)
    setError(null)
    try {
      await fn()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to save. Please try again."
      setError(message)
      throw err
    } finally {
      setIsSaving(false)
    }
  }, [])

  const saveCreatorType = useCallback(
    (creatorType: OnboardingData["creatorType"]) =>
      run(() =>
        patchOnboarding(toCreatorTypePatch(creatorType)).then(() => {})
      ),
    [run]
  )

  const saveStudio = useCallback(
    (studioData: OnboardingData) =>
      run(() => patchOnboarding(toStudioPatch(studioData)).then(() => {})),
    [run]
  )

  const saveStudioSkip = useCallback(
    () => run(() => patchOnboarding({ step: "studio" }).then(() => {})),
    [run]
  )

  const saveContent = useCallback(
    (formats: OnboardingData["contentFormats"]) =>
      run(() =>
        patchOnboarding(
          toContentPatch(formats as Parameters<typeof toContentPatch>[0])
        ).then(() => {})
      ),
    [run]
  )

  const saveContentSkip = useCallback(
    () => run(() => patchOnboarding({ step: "content" }).then(() => {})),
    [run]
  )

  const saveGetStarted = useCallback(
    (mode: OnboardingData["getStartedMode"]) =>
      run(() => patchOnboarding(toGetStartedPatch(mode)).then(() => {})),
    [run]
  )

  const finishOnboarding =
    useCallback(async (): Promise<CompleteOnboardingResponse> => {
      setIsSaving(true)
      setError(null)
      try {
        return await completeOnboarding()
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to save. Please try again."
        setError(message)
        throw err
      } finally {
        setIsSaving(false)
      }
    }, [])

  return {
    data,
    isSaving,
    error,
    setError,
    saveCreatorType,
    saveStudio,
    saveStudioSkip,
    saveContent,
    saveContentSkip,
    saveGetStarted,
    finishOnboarding,
  }
}
