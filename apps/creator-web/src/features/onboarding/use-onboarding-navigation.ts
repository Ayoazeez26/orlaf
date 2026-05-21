import { useCallback, useState } from "react"
import { useOnboarding } from "./onboarding-context"
import { getNextStep, getPrevStep, getProgress } from "./steps"
import type { OnboardingStep } from "./types"

export function useOnboardingNavigation(
  initialStep: OnboardingStep = "welcome",
  onComplete?: () => void
) {
  const { data } = useOnboarding()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialStep)

  const progress = getProgress(currentStep, data)

  const goTo = useCallback((step: OnboardingStep) => {
    setCurrentStep(step)
  }, [])

  const goNext = useCallback(() => {
    const next = getNextStep(currentStep, data)
    if (next) {
      setCurrentStep(next)
    } else {
      onComplete?.()
    }
  }, [currentStep, data, onComplete])

  const goBack = useCallback(() => {
    const prev = getPrevStep(currentStep, data)
    if (prev) setCurrentStep(prev)
  }, [currentStep, data])

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
