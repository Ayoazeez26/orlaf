import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { useOnboardingPersist } from "../../hooks/use-onboarding-persist"
import { useOnboarding } from "../../onboarding-context"
import { OnboardingErrorNotice } from "../onboarding-error-notice"
import { OnboardingNav } from "../onboarding-nav"
import { OnboardingShell } from "../onboarding-shell"

interface RightsStepProps {
  progress: { currentIndex: number; total: number }
  onBack: () => void
  onNext: () => void
}

export function RightsStep({ progress, onBack, onNext }: RightsStepProps) {
  const { data, dispatch } = useOnboarding()
  const { saveRights, isSaving, error } = useOnboardingPersist()

  const handleNext = async () => {
    try {
      await saveRights(data)
      onNext()
    } catch {
      // error shown below
    }
  }

  return (
    <OnboardingShell
      progress={progress}
      showBack
      onBack={onBack}
      footer={
        <OnboardingNav
          onNext={handleNext}
          nextDisabled={!data.rightsConfirmed || isSaving}
        />
      }
    >
      <div>
        <h1 className="font-semibold text-2xl">Almost there</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          A couple of last details before you start creating.
        </p>
      </div>

      {error && (
        <OnboardingErrorNotice
          message={error}
          onRetry={handleNext}
          retrying={isSaving}
        />
      )}

      <div className="mt-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="social-link">
            Social link or handle{" "}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="social-link"
            type="url"
            placeholder="https://instagram.com/yourhandle"
            value={data.socialLink}
            onChange={(event) =>
              dispatch({ type: "SET_SOCIAL_LINK", payload: event.target.value })
            }
          />
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-border bg-input-bg px-4 py-3.5">
          <Switch
            id="rights-confirmed"
            checked={data.rightsConfirmed}
            onCheckedChange={(checked) =>
              dispatch({ type: "SET_RIGHTS_CONFIRMED", payload: checked })
            }
            className="mt-0.5"
          />
          <Label
            htmlFor="rights-confirmed"
            className="font-normal text-sm leading-5"
          >
            I confirm I own, or am authorised to use, the rights to everything I
            upload to Sable TV.
          </Label>
        </div>
      </div>
    </OnboardingShell>
  )
}
