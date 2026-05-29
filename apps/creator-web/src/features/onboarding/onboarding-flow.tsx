import { ThemeSwitcher } from "@/components/theme-switcher"
import { useNavigate } from "@tanstack/react-router"
import { ContentFormatStep } from "./components/steps/content-format-step"
import { CreatorTypeStep } from "./components/steps/creator-type-step"
import { GetStartedStep } from "./components/steps/get-started-step"
import { SignupStep } from "./components/steps/signup-step"
import { StudioStep } from "./components/steps/studio-step"
import { VerifyEmailStep } from "./components/steps/verify-email-step"
import { WelcomeStep } from "./components/steps/welcome-step"
import { ONBOARDING_STORAGE_KEY } from "./constants"
import { useOnboarding } from "./onboarding-context"
import type { AuthMethod } from "./types"
import { useOnboardingNavigation } from "./use-onboarding-navigation"

export function OnboardingFlow() {
  const navigate = useNavigate()
  const { data } = useOnboarding()

  const handleAuthSelect = (method: AuthMethod) => {
    if (method === "email") {
      goTo("signup")
    } else {
      goTo("creator-type")
    }
  }

  const handleComplete = () => {
    sessionStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(data))
    navigate({ to: "/dashboard", replace: true })
  }

  const navigation = useOnboardingNavigation("welcome", handleComplete)
  const { currentStep, progress, goNext, goBack, goTo } = navigation

  const stepContent = (() => {
    switch (currentStep) {
    case "welcome":
      return <WelcomeStep progress={progress} onAuthSelect={handleAuthSelect} />
    case "signup":
      return <SignupStep progress={progress} onBack={goBack} onNext={goNext} />
    case "verify":
      return (
        <VerifyEmailStep progress={progress} onBack={goBack} onNext={goNext} />
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
      return <WelcomeStep progress={progress} onAuthSelect={handleAuthSelect} />
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
