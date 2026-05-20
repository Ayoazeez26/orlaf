import { Building2, User } from "lucide-react"
import { useState } from "react"
import { useOnboarding } from "../../onboarding-context"
import type { CreatorType } from "../../types"
import { OnboardingNav } from "../onboarding-nav"
import { OnboardingShell } from "../onboarding-shell"
import { SelectionCard } from "../selection-card"

interface CreatorTypeStepProps {
  progress: { currentIndex: number; total: number }
  onBack: () => void
  onNext: () => void
  onSkip: () => void
}

export function CreatorTypeStep({
  progress,
  onBack,
  onNext,
  onSkip,
}: CreatorTypeStepProps) {
  const { data, dispatch } = useOnboarding()
  const [selected, setSelected] = useState<CreatorType | null>(data.creatorType)

  const handleNext = () => {
    if (selected) {
      dispatch({ type: "SET_CREATOR_TYPE", payload: selected })
    }
    onNext()
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
          onSkip={onSkip}
          onNext={handleNext}
          nextDisabled={!selected}
        />
      }
    >
      <div>
        <h1 className="font-semibold text-2xl">How do you create?</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          This helps us tailor your Creator Studio experience.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <SelectionCard
          icon={User}
          title="Solo Creator"
          description="I'm an independent filmmaker or content creator"
          selected={selected === "solo"}
          onClick={() => handleSelect("solo")}
        />
        <SelectionCard
          icon={Building2}
          title="Studio"
          description="I'm part of a production team or studio"
          selected={selected === "studio"}
          onClick={() => handleSelect("studio")}
        />
      </div>
    </OnboardingShell>
  )
}
