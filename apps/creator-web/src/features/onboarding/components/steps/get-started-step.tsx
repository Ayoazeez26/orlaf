import {
  ChevronRight,
  FileText,
  LayoutGrid,
  Scissors,
  Upload,
  Wand2,
} from "lucide-react"
import { useState } from "react"
import { useOnboarding } from "../../onboarding-context"
import type { GetStartedMode } from "../../types"
import { OnboardingNav } from "../onboarding-nav"
import { OnboardingShell } from "../onboarding-shell"
import { SelectionCard } from "../selection-card"

interface GetStartedStepProps {
  progress: { currentIndex: number; total: number }
  onBack: () => void
  onNext: () => void
  onSkip: () => void
}

const STUDIO_TOOL_ITEMS = [
  { label: "Auto-edit & fine-tune episodes", icon: Scissors },
  { label: "Generate Magic Clips", icon: Wand2 },
  { label: "Export & publish to your audience", icon: FileText },
] as const

export function GetStartedStep({
  progress,
  onBack,
  onNext,
  onSkip,
}: GetStartedStepProps) {
  const { data, dispatch } = useOnboarding()
  const [selected, setSelected] = useState<GetStartedMode | null>(
    data.getStartedMode
  )

  const handleSelect = (mode: GetStartedMode) => {
    setSelected(mode)
    dispatch({ type: "SET_GET_STARTED_MODE", payload: mode })
  }

  const handleNext = () => {
    if (selected) {
      dispatch({ type: "SET_GET_STARTED_MODE", payload: selected })
    }
    onNext()
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
          nextLabel="Continue to Dashboard"
          nextDisabled={false}
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
