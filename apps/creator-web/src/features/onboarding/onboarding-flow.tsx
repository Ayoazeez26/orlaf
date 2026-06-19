import { useNavigate, useSearch } from "@tanstack/react-router"
import { useEffect } from "react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { useAuth } from "@/features/auth/auth-context"
import { markOnboardingComplete, hasCompletedOnboarding } from "@/features/auth/lib/onboarding-complete"
import { ConsentStep } from "./components/steps/consent-step"
import { ContentFormatStep } from "./components/steps/content-format-step"
import { CreatorTypeStep } from "./components/steps/creator-type-step"
import { GetStartedStep } from "./components/steps/get-started-step"
import { SignupStep } from "./components/steps/signup-step"
import { StudioStep } from "./components/steps/studio-step"
import { VerifyEmailStep } from "./components/steps/verify-email-step"
import { WelcomeStep } from "./components/steps/welcome-step"
import { ONBOARDING_STORAGE_KEY } from "./constants"
import { useOnboarding } from "./onboarding-context"
import type { OnboardingStep } from "./types"
import { useOnboardingNavigation } from "./use-onboarding-navigation"

function parseInitialStep(step?: string): OnboardingStep {
  const valid: OnboardingStep[] = [
    "welcome",
    "consent",
    "signup",
    "verify",
    "creator-type",
    "studio",
    "content",
    "get-started",
  ]
  if (step && valid.includes(step as OnboardingStep)) {
    return step as OnboardingStep
  }
  return "welcome"
}

export function OnboardingFlow() {
  const navigate = useNavigate()
  const { isAuthenticated, session } = useAuth()
  const { data, dispatch } = useOnboarding()
  const search = useSearch({ from: "/onboarding" })

  useEffect(() => {
    const step = parseInitialStep(search.step)
    if ((step === "consent" || step === "creator-type") && session) {
      dispatch({ type: "SET_AUTH_METHOD", payload: "google" })
    }
  }, [search.step, session, dispatch])

  useEffect(() => {
    if (isAuthenticated && !search.step && !hasCompletedOnboarding()) {
      navigate({
        to: "/onboarding",
        search: { step: "creator-type" },
        replace: true,
      })
    }
  }, [isAuthenticated, search.step, navigate])

  const handleComplete = () => {
    if (!isAuthenticated) {
      navigate({ to: "/onboarding", replace: true })
      return
    }
    sessionStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(data))
    markOnboardingComplete()
    navigate({ to: "/dashboard", replace: true })
  }

  const initialStep = parseInitialStep(search.step)
  const navigation = useOnboardingNavigation(initialStep, handleComplete)
  const { currentStep, progress, goNext, goBack, goTo } = navigation

  const stepContent = (() => {
    switch (currentStep) {
      case "welcome":
        return <WelcomeStep progress={progress} />
      case "consent":
        return (
          <ConsentStep
            progress={progress}
            onBack={goBack}
            onNext={() => goTo("creator-type")}
          />
        )
      case "signup":
        return (
          <SignupStep progress={progress} onBack={goBack} onNext={goNext} />
        )
      case "verify":
        return (
          <VerifyEmailStep
            progress={progress}
            onBack={goBack}
            onNext={goNext}
          />
        )
      case "creator-type":
        return (
          <CreatorTypeStep
            progress={progress}
            onBack={goBack}
            onNext={goNext}
            onSkip={goNext}
          />
        )
      case "studio":
        return (
          <StudioStep
            progress={progress}
            onBack={goBack}
            onNext={goNext}
            onSkip={goNext}
          />
        )
      case "content":
        return (
          <ContentFormatStep
            progress={progress}
            onBack={goBack}
            onNext={goNext}
            onSkip={goNext}
          />
        )
      case "get-started":
        return (
          <GetStartedStep
            progress={progress}
            onBack={goBack}
            onNext={goNext}
            onSkip={handleComplete}
          />
        )
      default:
        return <WelcomeStep progress={progress} />
    }
  })()

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 left-4 z-10 flex justify-end sm:left-auto">
        <ThemeSwitcher compact />
      </div>
      {stepContent}
    </div>
  )
}
