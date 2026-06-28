import type { OnboardingData, OnboardingStep } from "./types"

export function getStepSequence(data: OnboardingData): OnboardingStep[] {
  const steps: OnboardingStep[] = ["welcome"]

  if (!data.authMethod) {
    return [
      "welcome",
      "signup",
      "verify",
      "creator-type",
      ...(data.creatorType === "studio" ? (["studio"] as const) : []),
      "content",
      "get-started",
    ]
  }

  if (data.authMethod === "email") {
    steps.push("signup", "verify", "consent")
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
  if (index > 0) {
    return sequence[index - 1] ?? null
  }

  return getStaticPrevStep(current, data)
}

function getStaticPrevStep(
  current: OnboardingStep,
  data: OnboardingData
): OnboardingStep | null {
  switch (current) {
    case "studio":
      return "creator-type"
    case "content":
      return data.creatorType === "studio" ? "studio" : "creator-type"
    case "get-started":
      return "content"
    case "creator-type":
      if (data.authMethod === "email") return "consent"
      if (data.authMethod === "google" || data.authMethod === "apple") {
        return "consent"
      }
      return "verify"
    case "consent":
      if (data.authMethod === "email") return "verify"
      return "welcome"
    case "verify":
      return "signup"
    case "signup":
      return "welcome"
    default:
      return null
  }
}
