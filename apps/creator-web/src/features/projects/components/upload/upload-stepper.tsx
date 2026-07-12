import { cn } from "@workspace/ui/lib/utils"
import { Check } from "lucide-react"
import { SCROLLABLE_HORIZONTAL_CLASS } from "@/lib/scrollable-tab-nav"
import { UPLOAD_WIZARD_STEPS } from "../../constants"
import type { UploadWizardState } from "../../types"

interface UploadStepperProps {
  currentStep: UploadWizardState["step"]
}

export function UploadStepper({ currentStep }: UploadStepperProps) {
  const stepOrder = UPLOAD_WIZARD_STEPS.map((s) => s.id)
  const currentIndex = stepOrder.indexOf(currentStep)

  return (
    <nav
      className={cn(
        SCROLLABLE_HORIZONTAL_CLASS,
        "flex flex-nowrap items-center gap-2"
      )}
      aria-label="Upload progress"
    >
      {UPLOAD_WIZARD_STEPS.map((step, index) => {
        const isComplete = index < currentIndex
        const isActive = step.id === currentStep

        return (
          <div key={step.id} className="flex shrink-0 items-center gap-2">
            {index > 0 && (
              <span
                className="shrink-0 text-muted-foreground text-xs"
                aria-hidden
              >
                →
              </span>
            )}
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 font-medium text-sm",
                isActive && "bg-primary text-primary-foreground",
                isComplete && !isActive && "bg-primary/10 text-primary",
                !isActive && !isComplete && "bg-muted text-muted-foreground"
              )}
            >
              {isComplete ? (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </span>
              ) : isActive ? (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20">
                  {step.number}
                </span>
              ) : (
                <span className="flex size-5 shrink-0 items-center justify-center">
                  {step.number}
                </span>
              )}
              {step.label}
            </span>
          </div>
        )
      })}
    </nav>
  )
}
