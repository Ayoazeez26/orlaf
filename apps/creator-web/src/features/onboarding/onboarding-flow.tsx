import { useNavigate, useSearch } from "@tanstack/react-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { useAuth } from "@/features/auth/auth-context"
import {
  onboardingStepFromApi,
  resolvePostSignInRoute,
} from "@/features/auth/lib/post-sign-in-route"
import { validateCreatorInvite } from "./api/invite-api"
import { getOnboardingStatus } from "./api/onboarding-api"
import {
  InviteErrorStep,
  InviteLandingStep,
  InviteLoadingStep,
} from "./components/invite-landing-step"
import { ConsentStep } from "./components/steps/consent-step"
import { ContentFormatStep } from "./components/steps/content-format-step"
import { CreatorTypeStep } from "./components/steps/creator-type-step"
import { GetStartedStep } from "./components/steps/get-started-step"
import { SignupStep } from "./components/steps/signup-step"
import { StudioStep } from "./components/steps/studio-step"
import { VerifyEmailStep } from "./components/steps/verify-email-step"
import { WelcomeStep } from "./components/steps/welcome-step"
import { useOnboardingPersist } from "./hooks/use-onboarding-persist"
import { clearOnboardingProgress, useOnboarding } from "./onboarding-context"
import type { OnboardingStep } from "./types"
import { useOnboardingNavigation } from "./use-onboarding-navigation"

const AUTH_ONLY_STEPS: OnboardingStep[] = [
  "creator-type",
  "studio",
  "content",
  "get-started",
]

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
  const { isAuthenticated, session, updateSession } = useAuth()
  const { data, dispatch } = useOnboarding()
  const { finishOnboarding } = useOnboardingPersist()
  const search = useSearch({ from: "/onboarding" })
  const hasHydratedRef = useRef(false)
  const [inviteLoading, setInviteLoading] = useState(false)

  const onboardingSearch = useCallback(
    (step?: OnboardingStep) => ({
      step,
      invite: search.invite,
    }),
    [search.invite]
  )

  const navigateToStep = useCallback(
    (step: OnboardingStep) => {
      navigate({
        to: "/onboarding",
        search: onboardingSearch(step),
        replace: true,
      })
    },
    [navigate, onboardingSearch]
  )

  useEffect(() => {
    const token = search.invite
    if (!token || isAuthenticated) return
    if (data.inviteToken === token && data.inviteValidated) return

    let cancelled = false
    setInviteLoading(true)

    validateCreatorInvite(token)
      .then((result) => {
        if (cancelled) return

        if (result.valid) {
          dispatch({
            type: "SET_INVITE",
            payload: {
              token,
              email: result.email,
              firstName: result.firstName,
              lastName: result.lastName,
              note: result.note,
            },
          })
          dispatch({ type: "SET_AUTH_METHOD", payload: "email" })
          if (!search.step) {
            navigateToStep("signup")
          }
          return
        }

        dispatch({
          type: "SET_INVITE_ERROR",
          payload: result.message ?? "This invite link is no longer valid.",
        })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message =
          err instanceof Error
            ? err.message
            : "Unable to validate this invite. Please try again."
        dispatch({ type: "SET_INVITE_ERROR", payload: message })
      })
      .finally(() => {
        if (!cancelled) setInviteLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [
    search.invite,
    search.step,
    isAuthenticated,
    data.inviteToken,
    data.inviteValidated,
    dispatch,
    navigateToStep,
  ])

  useEffect(() => {
    if (!isAuthenticated || !session) return
    if (session.account_state !== "onboarding") return
    if (hasHydratedRef.current) return

    hasHydratedRef.current = true

    getOnboardingStatus()
      .then((status) => {
        dispatch({ type: "HYDRATE_FROM_API", payload: status })
        const apiStep = onboardingStepFromApi(status)
        if (!search.step && apiStep) {
          navigateToStep(apiStep)
        }
      })
      .catch(() => {
        hasHydratedRef.current = false
      })
  }, [isAuthenticated, session, dispatch, search.step, navigateToStep])

  useEffect(() => {
    if (search.step === "studio" && data.creatorType !== "studio") {
      dispatch({ type: "SET_CREATOR_TYPE", payload: "studio" })
    }
  }, [search.step, data.creatorType, dispatch])

  useEffect(() => {
    if (!isAuthenticated || !session) return

    const destination = resolvePostSignInRoute(session)
    if (destination.to !== "/onboarding") {
      if (destination.search?.step) {
        void navigate({
          to: destination.to,
          search: destination.search,
          replace: true,
        })
      } else {
        void navigate({ to: destination.to, replace: true })
      }
      return
    }

    if (search.step) return

    if (session.needs_consent) {
      navigateToStep("consent")
      return
    }

    if (session.account_state === "onboarding") {
      navigateToStep("creator-type")
    }
  }, [isAuthenticated, session, search.step, navigateToStep, navigate])

  const handleComplete = useCallback(async () => {
    if (!isAuthenticated) {
      navigate({ to: "/onboarding", replace: true })
      return
    }

    try {
      const result = await finishOnboarding()
      clearOnboardingProgress()
      updateSession({ account_state: result.account_state })
      navigate({ to: result.redirect, replace: true })
    } catch {
      // error surfaced by useOnboardingPersist in step components
    }
  }, [isAuthenticated, finishOnboarding, updateSession, navigate])

  const initialStep = parseInitialStep(search.step)
  const navigation = useOnboardingNavigation(
    initialStep,
    handleComplete,
    navigateToStep
  )
  const { currentStep, progress, goNext, goBack, goTo } = navigation

  // Never let an unauthenticated user sit on an auth-only step: a save there
  // would fire without a token and fail. Send them back to the welcome step.
  // (AuthProvider blocks render until auth is settled, so this can't misfire
  // during bootstrap.)
  useEffect(() => {
    if (!isAuthenticated && AUTH_ONLY_STEPS.includes(currentStep)) {
      navigateToStep("welcome")
    }
  }, [isAuthenticated, currentStep, navigateToStep])

  if (search.invite && !isAuthenticated) {
    if (inviteLoading || (!data.inviteValidated && !data.inviteError)) {
      return <InviteLoadingStep />
    }

    if (data.inviteError) {
      return <InviteErrorStep message={data.inviteError} />
    }

    if (data.inviteValidated && currentStep === "welcome") {
      return (
        <InviteLandingStep
          note={data.inviteNote}
          email={data.profile.email || undefined}
          onContinue={() => goTo("signup")}
        />
      )
    }
  }

  const stepContent = (() => {
    switch (currentStep) {
      case "welcome":
        return (
          <WelcomeStep
            progress={progress}
            onContinueEmail={() => goTo("signup")}
          />
        )
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
        return <VerifyEmailStep progress={progress} onBack={goBack} />
      case "creator-type":
        return (
          <CreatorTypeStep
            progress={progress}
            onBack={goBack}
            onNext={(creatorType) =>
              goTo(creatorType === "studio" ? "studio" : "content")
            }
            onSkip={() => goTo("content")}
          />
        )
      case "studio":
        return (
          <StudioStep
            progress={progress}
            onBack={() => goTo("creator-type")}
            onNext={goNext}
            onSkip={goNext}
          />
        )
      case "content":
        return (
          <ContentFormatStep
            progress={progress}
            onBack={() =>
              goTo(data.creatorType === "studio" ? "studio" : "creator-type")
            }
            onNext={goNext}
            onSkip={goNext}
          />
        )
      case "get-started":
        return (
          <GetStartedStep
            progress={progress}
            onBack={goBack}
            onComplete={handleComplete}
          />
        )
      default:
        return (
          <WelcomeStep
            progress={progress}
            onContinueEmail={() => goTo("signup")}
          />
        )
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
