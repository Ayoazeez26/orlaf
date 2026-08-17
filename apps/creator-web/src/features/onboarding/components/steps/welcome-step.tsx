import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { Mail } from "lucide-react"
import { SableBrandMark } from "@/components/sable-brand-mark"
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button"
import { toastApiError } from "@/lib/toast"
import { useOnboarding } from "../../onboarding-context"
import { OnboardingProgress } from "../onboarding-progress"

interface WelcomeStepProps {
  progress: { currentIndex: number; total: number }
  onContinueEmail: () => void
}

function AppleIcon() {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

export function WelcomeStep({ progress, onContinueEmail }: WelcomeStepProps) {
  const { dispatch } = useOnboarding()

  const handleContinueEmail = () => {
    dispatch({ type: "SET_AUTH_METHOD", payload: "email" })
    onContinueEmail()
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-8 sm:py-10">
      <SableBrandMark className="mb-6" subtitle="Creators" />
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <h1 className="font-semibold text-xl sm:text-2xl">
            Let&apos;s get you started
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Your Creator Studio for short dramas &amp; series
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <GoogleSignInButton
            onSuccess={() =>
              dispatch({ type: "SET_AUTH_METHOD", payload: "google" })
            }
            onError={toastApiError}
          />

          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled
            className="h-12 w-full cursor-not-allowed justify-center gap-3 rounded-xl font-medium text-base opacity-60"
          >
            <AppleIcon />
            Continue with Apple
            <span className="text-muted-foreground text-xs">(Coming soon)</span>
          </Button>

          <div className="relative my-2">
            <Separator />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-muted-foreground text-xs">
              or
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleContinueEmail}
            className="h-12 w-full justify-center gap-3 rounded-xl font-medium text-base"
          >
            <Mail className="size-5 text-muted-foreground" />
            Continue with Email
          </Button>
        </div>

        <p className="mt-6 text-center text-muted-foreground text-xs">
          By signing up, you agree to our{" "}
          <button type="button" className="text-primary hover:underline">
            Terms
          </button>{" "}
          &amp;{" "}
          <button type="button" className="text-primary hover:underline">
            Privacy Policy
          </button>
        </p>

        <p className="mt-4 text-center text-muted-foreground text-sm">
          Have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>

        <div className="mt-10">
          <OnboardingProgress
            currentIndex={progress.currentIndex}
            total={progress.total}
          />
        </div>
      </div>
    </div>
  )
}
