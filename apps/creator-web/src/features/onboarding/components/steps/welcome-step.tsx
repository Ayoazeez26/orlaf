import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { Mail } from "lucide-react"
import { useOnboarding } from "../../onboarding-context"
import type { AuthMethod } from "../../types"
import { OnboardingProgress } from "../onboarding-progress"

interface WelcomeStepProps {
  progress: { currentIndex: number; total: number }
  onAuthSelect: (method: AuthMethod) => void
}

function GoogleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
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

export function WelcomeStep({ progress, onAuthSelect }: WelcomeStepProps) {
  const { dispatch } = useOnboarding()

  const handleAuth = (method: AuthMethod) => {
    dispatch({ type: "SET_AUTH_METHOD", payload: method })
    onAuthSelect(method)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[#f4f4f5] px-4 py-10">
      <p className="mb-6 text-lg font-semibold"><span className="font-bold">Sable</span> Creators</p>
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            Let&apos;s get you started
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your Creator Studio for short dramas &amp; series
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-12 w-full justify-center gap-3 cursor-pointer rounded-xl text-base font-medium"
            onClick={() => handleAuth("google")}
          >
            <GoogleIcon />
            Continue with Google
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-12 w-full justify-center gap-3 cursor-pointer rounded-xl text-base font-medium"
            onClick={() => handleAuth("apple")}
          >
            <AppleIcon />
            Continue with Apple
          </Button>

          <div className="relative my-2">
            <Separator />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
              or
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-12 w-full justify-center gap-3 cursor-pointer rounded-xl text-base font-medium"
            onClick={() => handleAuth("email")}
          >
            <Mail className="size-5 text-muted-foreground" />
            Continue with Email
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <button type="button" className="text-primary hover:underline">
            Terms
          </button>{" "}
          &amp;{" "}
          <button type="button" className="text-primary hover:underline">
            Privacy Policy
          </button>
        </p>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Have an account?{" "}
          <button
            type="button"
            className="text-primary hover:underline"
          >
            Log in
          </button>
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
