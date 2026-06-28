import {
  ChevronRight,
  FileText,
  LayoutGrid,
  Loader2,
  Scissors,
  Upload,
  Wand2,
} from "lucide-react"
import { useState } from "react"
import { useOnboardingPersist } from "../../hooks/use-onboarding-persist"
import { useOnboarding } from "../../onboarding-context"
import type { GetStartedMode } from "../../types"
import { OnboardingNav } from "../onboarding-nav"
import { OnboardingShell } from "../onboarding-shell"
import { SelectionCard } from "../selection-card"

interface GetStartedStepProps {
  progress: { currentIndex: number; total: number }
  onBack: () => void
  onComplete: () => void
}

const STUDIO_TOOL_ITEMS = [
  { label: "Auto-edit & fine-tune episodes", icon: Scissors },
  { label: "Generate Magic Clips", icon: Wand2 },
  { label: "Export & publish to your audience", icon: FileText },
] as const

export function GetStartedStep({
  progress,
  onBack,
  onComplete,
}: GetStartedStepProps) {
  const { data, dispatch } = useOnboarding()
  const { saveGetStarted, isSaving, error } = useOnboardingPersist()
  const [selected, setSelected] = useState<GetStartedMode | null>(
    data.getStartedMode
  )

  const handleSelect = (mode: GetStartedMode) => {
    setSelected(mode)
    dispatch({ type: "SET_GET_STARTED_MODE", payload: mode })
  }

  const handleFinish = async (mode: GetStartedMode | null) => {
    try {
      if (mode) {
        await saveGetStarted(mode)
      }
      onComplete()
    } catch {
      // error shown below
    }
  }

  const handleNext = () => {
    if (selected) {
      dispatch({ type: "SET_GET_STARTED_MODE", payload: selected })
    }
    void handleFinish(selected)
  }

  return (
    <OnboardingShell
      progress={progress}
      showBack
      onBack={onBack}
      wide
      footer={
        <OnboardingNav
          onSkip={() => void handleFinish(null)}
          onNext={handleNext}
          nextLabel="Get Started"
          nextDisabled={isSaving}
        />
      }
    >
      <div>
        <h1 className="font-semibold text-2xl">
          How do you want to get started?
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Upload episodes or create your first series from scratch.
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
          Finishing setup…
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <SelectionCard
          icon={Upload}
          title="Upload episodes"
          description="Upload your video files and build your series"
          selected={selected === "upload"}
          onClick={() => handleSelect("upload")}
        />
        <SelectionCard
          icon={LayoutGrid}
          title="Create a new series"
          description="Set up your series details and add episodes step by step"
          selected={selected === "create-series"}
          onClick={() => handleSelect("create-series")}
        />
      </div>

      <div className="mt-8">
        <p className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Studio Tools
        </p>
        <ul className="flex flex-col gap-2">
          {STUDIO_TOOL_ITEMS.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-input-bg px-4 py-3.5"
            >
              <item.icon className="size-5 shrink-0 text-muted-foreground" />
              <span className="flex-1 font-medium text-sm">{item.label}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </li>
          ))}
        </ul>
      </div>
    </OnboardingShell>
  )
}
