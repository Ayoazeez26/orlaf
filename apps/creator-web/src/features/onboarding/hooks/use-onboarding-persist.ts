import type { CompleteOnboardingResponse } from "@sable/contracts"
import { useCallback, useState } from "react"
import { ApiError } from "@/lib/http-client"
import { completeOnboarding, patchOnboarding } from "../api/onboarding-api"
import {
  toContentPatch,
  toCreatorTypePatch,
  toGetStartedPatch,
  toStudioPatch,
} from "../lib/onboarding-mappers"
import { useOnboarding } from "../onboarding-context"
import type { OnboardingData } from "../types"

/**
 * Maps low-level save errors to a friendly, actionable message. Progress is
 * kept in context (and mirrored to sessionStorage), so a transient failure
 * never discards the user's selections — they can simply retry.
 */
function toFriendlyMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) {
      return "Your session timed out. Please sign in again — your progress is saved."
    }
    if (err.status >= 500) {
      return "Something went wrong on our end. Please try again."
    }
  }
  // fetch() network failures surface as TypeError
  if (err instanceof TypeError) {
    return "We couldn't reach the server. Check your connection and try again."
  }
  return err instanceof Error ? err.message : "Unable to save. Please try again."
}

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
      setError(toFriendlyMessage(err))
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
        setError(toFriendlyMessage(err))
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
