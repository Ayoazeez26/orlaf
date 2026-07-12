import { Button } from "@workspace/ui/components/button"
import { UserPlus } from "lucide-react"

interface OnboardingPageHeaderProps {
  onOnboardCreator?: () => void
}

export function OnboardingPageHeader({
  onOnboardCreator,
}: OnboardingPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Onboarding
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Review applications, send invites, and manually onboard creators.
        </p>
      </div>
      <Button
        type="button"
        className="shrink-0 gap-2"
        onClick={onOnboardCreator}
      >
        <UserPlus className="size-4" aria-hidden />
        Onboard Creator
      </Button>
    </div>
  )
}
