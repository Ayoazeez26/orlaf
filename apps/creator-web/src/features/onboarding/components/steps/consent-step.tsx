import type { PolicyVersions } from "@sable/contracts"
import { Button } from "@workspace/ui/components/button"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { getPolicies, recordConsent } from "@/features/auth/api/auth-api"
import { useAuth } from "@/features/auth/auth-context"
import { OnboardingShell } from "../onboarding-shell"

interface ConsentStepProps {
  progress: { currentIndex: number; total: number }
  onBack: () => void
  onNext: () => void
}

export function ConsentStep({ progress, onBack, onNext }: ConsentStepProps) {
  const { session, updateSession } = useAuth()
  const [policies, setPolicies] = useState<PolicyVersions | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(true)

  useEffect(() => {
    getPolicies()
      .then(setPolicies)
      .catch(() =>
        setError("Unable to load policy versions. Please try again.")
      )
      .finally(() => setIsLoadingPolicies(false))
  }, [])

  const handleAccept = async () => {
    if (!policies) return
    setIsSubmitting(true)
    setError(null)
    try {
      await recordConsent({
        accepted: true,
        policyVersions: policies,
      })
      updateSession({ needs_consent: false })
      onNext()
    } catch {
      setError("Unable to record consent. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <OnboardingShell progress={progress} showBack onBack={onBack}>
      <div className="text-center">
        <h1 className="font-semibold text-xl sm:text-2xl">
          Review our policies
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Please accept our terms to continue using Sable Creators.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {session?.email && (
          <p className="text-center text-muted-foreground text-sm">
            Signed in as{" "}
            <span className="text-foreground">{session.email}</span>
          </p>
        )}

        <p className="text-center text-muted-foreground text-sm">
          By continuing, you agree to our{" "}
          <button type="button" className="text-primary hover:underline">
            Terms of Service
          </button>
          ,{" "}
          <button type="button" className="text-primary hover:underline">
            Privacy Policy
          </button>
          ,{" "}
          <button type="button" className="text-primary hover:underline">
            Community Guidelines
          </button>
          , and{" "}
          <button type="button" className="text-primary hover:underline">
            Payment Policy
          </button>
          .
        </p>

        {isLoadingPolicies && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading policies…
          </div>
        )}

        {error && (
          <p className="text-center text-destructive text-sm" role="alert">
            {error}
          </p>
        )}

        <Button
          type="button"
          size="lg"
          className="h-12 w-full rounded-xl font-medium"
          disabled={!policies || isSubmitting || isLoadingPolicies}
          onClick={handleAccept}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Saving…
            </>
          ) : (
            "I agree and continue"
          )}
        </Button>
      </div>
    </OnboardingShell>
  )
}
