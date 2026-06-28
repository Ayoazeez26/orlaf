import { useCallback, useEffect, useState } from "react"
import { useOnboarding } from "./onboarding-context"
import { getNextStep, getPrevStep, getProgress } from "./steps"
import type { OnboardingStep } from "./types"

export function useOnboardingNavigation(
  initialStep: OnboardingStep = "welcome",
  onComplete?: () => void,
  onNavigate?: (step: OnboardingStep) => void
) {
  const { data } = useOnboarding()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialStep)

  useEffect(() => {
    setCurrentStep(initialStep)
  }, [initialStep])

  const progress = getProgress(currentStep, data)

  const goTo = useCallback(
    (step: OnboardingStep) => {
      setCurrentStep(step)
      onNavigate?.(step)
    },
    [onNavigate]
  )

  const goNext = useCallback(() => {
    const next = getNextStep(currentStep, data)
    if (next) {
      setCurrentStep(next)
      onNavigate?.(next)
    } else {
      onComplete?.()
    }
  }, [currentStep, data, onComplete, onNavigate])

  const goBack = useCallback(() => {
    const prev = getPrevStep(currentStep, data)
    if (prev) {
      setCurrentStep(prev)
      onNavigate?.(prev)
    }
  }, [currentStep, data, onNavigate])

  const canGoBack = getPrevStep(currentStep, data) !== null

  return {
    currentStep,
    progress,
    goTo,
    goNext,
    goBack,
    canGoBack,
  }
}
