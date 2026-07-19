import type { ValidateCreatorInviteResponse } from "@sable/contracts"
import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Mail } from "lucide-react"
import { SableBrandMark } from "@/components/sable-brand-mark"
import { ThemeSwitcher } from "@/components/theme-switcher"

interface InviteLandingStepProps {
  note?: string | null
  email?: string
  onContinue: () => void
}

export function InviteLandingStep({
  note,
  email,
  onContinue,
}: InviteLandingStepProps) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background px-4 py-8 sm:py-10">
      <div className="absolute top-4 right-4 left-4 z-10 flex justify-end sm:left-auto">
        <ThemeSwitcher compact />
      </div>
      <SableBrandMark className="mb-6" subtitle="Creators" />
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="size-7 text-primary" />
          </div>
          <h1 className="font-semibold text-xl sm:text-2xl">
            You&apos;re invited to Sable
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            {email
              ? `Create your creator account for ${email}.`
              : "Create your creator account to get started."}
          </p>
          {note ? (
            <p className="mt-4 rounded-xl border border-border bg-muted/40 px-4 py-3 text-left text-muted-foreground text-sm">
              {note}
            </p>
          ) : null}
        </div>

        <Button
          type="button"
          size="lg"
          className="mt-8 h-12 w-full rounded-xl text-base"
          onClick={onContinue}
        >
          Continue with Email
        </Button>

        <p className="mt-4 text-center text-muted-foreground text-sm">
          Have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

interface InviteErrorStepProps {
  message: string
}

export function InviteErrorStep({ message }: InviteErrorStepProps) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background px-4 py-8 sm:py-10">
      <div className="absolute top-4 right-4 left-4 z-10 flex justify-end sm:left-auto">
        <ThemeSwitcher compact />
      </div>
      <SableBrandMark className="mb-6" subtitle="Creators" />
      <div className="w-full max-w-lg rounded-2xl border border-destructive/30 bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-center font-semibold text-xl sm:text-2xl">
          Invite unavailable
        </h1>
        <p
          className="mt-3 text-center text-muted-foreground text-sm"
          role="alert"
        >
          {message}
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button asChild size="lg" className="h-12 rounded-xl text-base">
            <Link to="/onboarding">Start without invite</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 rounded-xl text-base"
          >
            <Link to="/login">Log in</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function InviteLoadingStep() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background px-4 py-10">
      <div className="absolute top-4 right-4 left-4 z-10 flex justify-end sm:left-auto">
        <ThemeSwitcher compact />
      </div>
      <SableBrandMark className="mb-6" subtitle="Creators" />
      <div className="w-full max-w-lg animate-pulse rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mx-auto h-8 w-3/4 rounded-lg bg-muted" />
        <div className="mx-auto mt-3 h-4 w-1/2 rounded bg-muted" />
        <div className="mt-8 space-y-3">
          <div className="h-12 rounded-xl bg-muted" />
          <div className="h-12 rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  )
}

export type { ValidateCreatorInviteResponse }
