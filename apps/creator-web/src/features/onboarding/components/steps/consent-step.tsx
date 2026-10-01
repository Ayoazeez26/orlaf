import type { PolicyVersions } from "@sable/contracts"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import { Button } from "@workspace/ui/components/button"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { getPolicies, recordConsent } from "@/features/auth/api/auth-api"
import { useAuth } from "@/features/auth/auth-context"
import { useGuidelinesQuery } from "@/features/support/api/guidelines-hooks"
import { parseGuidelinesContent } from "@/lib/parse-guidelines-content"
import { toastApiError } from "@/lib/toast"
import { OnboardingShell } from "../onboarding-shell"

interface ConsentStepProps {
  progress: { currentIndex: number; total: number }
  onBack: () => void
  onNext: () => void
}

export function ConsentStep({ progress, onBack, onNext }: ConsentStepProps) {
  const { session, updateSession } = useAuth()
  const [policies, setPolicies] = useState<PolicyVersions | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(true)
  const guidelinesQuery = useGuidelinesQuery()
  const guidelinesBlocks = guidelinesQuery.data
    ? parseGuidelinesContent(guidelinesQuery.data.content)
    : []

  useEffect(() => {
    getPolicies()
      .then(setPolicies)
      .catch(() =>
        toastApiError("Unable to load policy versions. Please try again.")
      )
      .finally(() => setIsLoadingPolicies(false))
  }, [])

  const handleAccept = async () => {
    if (!policies) return
    setIsSubmitting(true)
    try {
      await recordConsent({
        accepted: true,
        policyVersions: policies,
      })
      updateSession({ needs_consent: false })
      onNext()
    } catch {
      toastApiError("Unable to record consent. Please try again.")
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
          , our Community Guidelines below, and{" "}
          <button type="button" className="text-primary hover:underline">
            Payment Policy
          </button>
          .
        </p>

        <Accordion type="single" collapsible className="rounded-lg border px-4">
          <AccordionItem value="community-guidelines" className="border-b-0">
            <AccordionTrigger>Community Guidelines</AccordionTrigger>
            <AccordionContent>
              {guidelinesQuery.isLoading ? (
                <div className="flex items-center gap-2 py-2 text-muted-foreground text-xs">
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                  Loading…
                </div>
              ) : (
                <div className="max-h-64 space-y-3 overflow-y-auto pr-1 text-left">
                  {guidelinesBlocks.map((block) =>
                    block.type === "heading" ? (
                      <p
                        key={`h-${block.text}`}
                        className="pt-1 font-semibold text-foreground text-xs first:pt-0"
                      >
                        {block.text}
                      </p>
                    ) : (
                      <p
                        key={`p-${block.text}`}
                        className="text-muted-foreground text-xs leading-5"
                      >
                        {block.text}
                      </p>
                    )
                  )}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {isLoadingPolicies && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading policies…
          </div>
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
