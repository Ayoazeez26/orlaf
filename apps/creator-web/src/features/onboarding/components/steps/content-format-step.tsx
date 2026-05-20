import { CONTENT_FORMATS } from "../../constants"
import { useOnboarding } from "../../onboarding-context"
import { FormatOption } from "../format-option"
import { OnboardingNav } from "../onboarding-nav"
import { OnboardingShell } from "../onboarding-shell"

interface ContentFormatStepProps {
  progress: { currentIndex: number; total: number }
  onBack: () => void
  onNext: () => void
  onSkip: () => void
}

export function ContentFormatStep({
  progress,
  onBack,
  onNext,
  onSkip,
}: ContentFormatStepProps) {
  const { data, dispatch } = useOnboarding()

  const handleToggle = (id: string) => {
    dispatch({ type: "TOGGLE_CONTENT_FORMAT", payload: id })
  }

  const hasSelection = data.contentFormats.length > 0

  return (
    <OnboardingShell
      progress={progress}
      showBack
      onBack={onBack}
      footer={
        <OnboardingNav
          onSkip={onSkip}
          onNext={onNext}
          nextDisabled={!hasSelection}
        />
      }
    >
      <div>
        <h1 className="font-semibold text-2xl">
          What type of content will you create?
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Pick your starting format — you can always explore others later.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {CONTENT_FORMATS.map((format) => (
          <FormatOption
            key={format.id}
            icon={format.icon}
            label={format.label}
            selected={data.contentFormats.includes(format.id)}
            onClick={() => handleToggle(format.id)}
          />
        ))}
      </div>
    </OnboardingShell>
  )
}
