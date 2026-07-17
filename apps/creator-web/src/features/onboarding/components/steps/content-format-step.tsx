import { CONTENT_FORMATS } from "../../constants"
import { useOnboardingPersist } from "../../hooks/use-onboarding-persist"
import { useOnboarding } from "../../onboarding-context"
import { FormatOption } from "../format-option"
import { OnboardingErrorNotice } from "../onboarding-error-notice"
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
  const { saveContent, saveContentSkip, isSaving, error } =
    useOnboardingPersist()

  const handleToggle = (id: string) => {
    dispatch({ type: "TOGGLE_CONTENT_FORMAT", payload: id })
  }

  const hasSelection = data.contentFormats.length > 0

  const handleNext = async () => {
    try {
      await saveContent(data.contentFormats)
      onNext()
    } catch {
      // error shown below
    }
  }

  const handleSkip = async () => {
    try {
      await saveContentSkip()
      onSkip()
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
          onSkip={handleSkip}
          onNext={handleNext}
          nextDisabled={!hasSelection || isSaving}
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

      {error && (
        <OnboardingErrorNotice
          message={error}
          onRetry={handleNext}
          retrying={isSaving}
        />
      )}

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
