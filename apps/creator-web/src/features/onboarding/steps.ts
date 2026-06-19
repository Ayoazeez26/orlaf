import type { OnboardingData, OnboardingStep } from "./types"

export function getStepSequence(data: OnboardingData): OnboardingStep[] {
  const steps: OnboardingStep[] = ["welcome"]

  if (!data.authMethod) {
    return [
      "welcome",
      "signup",
      "verify",
      "creator-type",
      "studio",
      "content",
      "get-started",
    ]
  }

  if (data.authMethod === "email") {
    steps.push("signup", "verify")
  }

  if (data.authMethod === "google" || data.authMethod === "apple") {
    steps.push("consent")
  }

  steps.push("creator-type")

  if (data.creatorType === "studio") {
    steps.push("studio")
  }

  steps.push("content", "get-started")
  return steps
}

export function getProgress(step: OnboardingStep, data: OnboardingData) {
  const sequence = getStepSequence(data)
  const index = sequence.indexOf(step)
  return {
    currentIndex: index === -1 ? 1 : index + 1,
    total: sequence.length,
  }
}

export function getNextStep(
  current: OnboardingStep,
  data: OnboardingData
): OnboardingStep | null {
  const sequence = getStepSequence(data)
  const index = sequence.indexOf(current)
  if (index === -1 || index >= sequence.length - 1) return null
  return sequence[index + 1] ?? null
}

export function getPrevStep(
  current: OnboardingStep,
  data: OnboardingData
): OnboardingStep | null {
  const sequence = getStepSequence(data)
  const index = sequence.indexOf(current)
  if (index <= 0) return null
  return sequence[index - 1] ?? null
}
