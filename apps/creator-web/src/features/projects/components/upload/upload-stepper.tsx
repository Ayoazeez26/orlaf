import { cn } from "@workspace/ui/lib/utils"
import { Check } from "lucide-react"
import { UPLOAD_WIZARD_STEPS } from "../../constants"
import type { UploadWizardState } from "../../types"

interface UploadStepperProps {
  currentStep: UploadWizardState["step"]
}

export function UploadStepper({ currentStep }: UploadStepperProps) {
  const stepOrder = UPLOAD_WIZARD_STEPS.map((s) => s.id)
  const currentIndex = stepOrder.indexOf(currentStep)

  return (
    <div className="flex flex-wrap items-center gap-2">
      {UPLOAD_WIZARD_STEPS.map((step, index) => {
        const isComplete = index < currentIndex
        const isActive = step.id === currentStep

        return (
          <div key={step.id} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-muted-foreground text-xs" aria-hidden>
                →
              </span>
            )}
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium text-sm",
                isActive && "bg-primary-gradient text-primary-foreground",
                isComplete &&
                  !isActive &&
                  "bg-upload-step-complete text-primary dark:bg-background",
                !isActive && !isComplete && "bg-muted text-muted-foreground"
              )}
            >
              {isComplete ? (
                <Check className="size-3.5" aria-hidden />
              ) : (
                <span>{step.number}</span>
              )}
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
