import { Building2, Loader2, User } from "lucide-react"
import { useState } from "react"
import { useOnboardingPersist } from "../../hooks/use-onboarding-persist"
import { useOnboarding } from "../../onboarding-context"
import type { CreatorType } from "../../types"
import { OnboardingNav } from "../onboarding-nav"
import { OnboardingShell } from "../onboarding-shell"
import { SelectionCard } from "../selection-card"

interface CreatorTypeStepProps {
  progress: { currentIndex: number; total: number }
  onBack: () => void
  onNext: (creatorType: CreatorType) => void
  onSkip: () => void
}

export function CreatorTypeStep({
  progress,
  onBack,
  onNext,
  onSkip,
}: CreatorTypeStepProps) {
  const { data, dispatch } = useOnboarding()
  const { saveCreatorType, isSaving, error } = useOnboardingPersist()
  const [selected, setSelected] = useState<CreatorType | null>(data.creatorType)

  const handleNext = async () => {
    if (!selected) return
    dispatch({ type: "SET_CREATOR_TYPE", payload: selected })
    try {
      await saveCreatorType(selected)
      onNext(selected)
    } catch {
      // error shown below
    }
  }

  const handleSkip = async () => {
    try {
      await saveCreatorType(null)
      onSkip()
    } catch {
      // error shown below
    }
  }

  const handleSelect = (type: CreatorType) => {
    setSelected(type)
    dispatch({ type: "SET_CREATOR_TYPE", payload: type })
  }

  return (
    <OnboardingShell
      progress={progress}
      showBack
      onBack={onBack}
      wide
      footer={
        <OnboardingNav
          onSkip={handleSkip}
          onNext={handleNext}
          nextDisabled={!selected || isSaving}
        />
      }
    >
      <div>
        <h1 className="font-semibold text-2xl">How do you create?</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          This helps us tailor your Creator Studio experience.
        </p>
      </div>

      {error && (
        <p className="mt-4 text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      {isSaving && (
        <p className="mt-4 flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Saving…
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <SelectionCard
          icon={User}
          title="Solo Creator"
          description="I'm an independent filmmaker or content creator."
          selected={selected === "solo"}
          onClick={() => handleSelect("solo")}
        />
        <SelectionCard
          icon={Building2}
          title="Studio"
          description="I'm part of a production team or studio."
          selected={selected === "studio"}
          onClick={() => handleSelect("studio")}
        />
      </div>
    </OnboardingShell>
  )
}
