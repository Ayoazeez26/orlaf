import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useEffect, useState } from "react"
import {
  PROMOTION_CREATOR_OPTIONS,
  PROMOTION_PLACEMENT_OPTIONS,
} from "../../constants"
import type { NewCampaignFormValues } from "../../types"
import { useModalShell } from "../use-modal-shell"

type WizardStep = "basics" | "schedule"

const STEPS: { id: WizardStep; label: string; number: number }[] = [
  { id: "basics", label: "Basics", number: 1 },
  { id: "schedule", label: "Placement & budget", number: 2 },
]

const EMPTY_VALUES: NewCampaignFormValues = {
  title: "",
  creatorName: PROMOTION_CREATOR_OPTIONS[0],
  placement: PROMOTION_PLACEMENT_OPTIONS[0],
  budget: 100_000,
  durationDays: 14,
}

interface NewCampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate?: (values: NewCampaignFormValues) => void
}

export function NewCampaignDialog({
  open,
  onOpenChange,
  onCreate,
}: NewCampaignDialogProps) {
  const [step, setStep] = useState<WizardStep>("basics")
  const [values, setValues] = useState<NewCampaignFormValues>(EMPTY_VALUES)

  useEffect(() => {
    if (!open) return
    setValues(EMPTY_VALUES)
    setStep("basics")
  }, [open])

  useModalShell(open, onOpenChange)

  if (!open) return null

  const stepIndex = STEPS.findIndex((item) => item.id === step)

  function update(patch: Partial<NewCampaignFormValues>) {
    setValues((current) => ({ ...current, ...patch }))
  }

  function handleNext() {
    if (stepIndex < STEPS.length - 1) {
      setStep(STEPS[stepIndex + 1]?.id)
      return
    }
    onCreate?.(values)
    onOpenChange(false)
  }

  function handleBack() {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1]?.id)
  }

  const canContinue =
    step === "basics"
      ? values.title.trim().length > 0 && values.creatorName.length > 0
      : values.budget > 0 && values.durationDays > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close dialog"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-campaign-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="new-campaign-title"
                className="font-semibold text-foreground text-lg"
              >
                New campaign
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                {step === "basics"
                  ? "Name the campaign and assign a creator."
                  : "Choose placement, budget, and run length."}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              <X className="size-4" aria-hidden />
            </Button>
          </div>

          <ol className="mt-5 flex items-center gap-3">
            {STEPS.map((item, index) => {
              const isComplete = index < stepIndex
              const isActive = item.id === step

              return (
                <li key={item.id} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full font-medium text-xs",
                      isComplete
                        ? "bg-primary text-primary-foreground"
                        : isActive
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isComplete ? (
                      <Check className="size-3.5" aria-hidden />
                    ) : (
                      item.number
                    )}
                  </span>
                  <span
                    className={cn(
                      "font-medium text-sm",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                  {index < STEPS.length - 1 ? (
                    <span
                      className="mx-1 hidden h-px w-8 bg-border sm:block"
                      aria-hidden
                    />
                  ) : null}
                </li>
              )
            })}
          </ol>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === "basics" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-title">Campaign title</Label>
                <Input
                  id="campaign-title"
                  value={values.title}
                  onChange={(event) => update({ title: event.target.value })}
                  placeholder="Lagos Nights — Season 2 boost"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-creator">Creator</Label>
                <Select
                  value={values.creatorName}
                  onValueChange={(creatorName) => update({ creatorName })}
                >
                  <SelectTrigger id="campaign-creator">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROMOTION_CREATOR_OPTIONS.map((creator) => (
                      <SelectItem key={creator} value={creator}>
                        {creator}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-placement">Placement</Label>
                <Select
                  value={values.placement}
                  onValueChange={(placement) => update({ placement })}
                >
                  <SelectTrigger id="campaign-placement">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROMOTION_PLACEMENT_OPTIONS.map((placement) => (
                      <SelectItem key={placement} value={placement}>
                        {placement}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-muted-foreground text-xs">
                  Where viewers will see this promotion across Sable TV.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="campaign-budget">Total budget (₦)</Label>
                  <Input
                    id="campaign-budget"
                    type="number"
                    min={1}
                    value={values.budget}
                    onChange={(event) =>
                      update({ budget: Number(event.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-duration">Duration (days)</Label>
                  <Input
                    id="campaign-duration"
                    type="number"
                    min={1}
                    value={values.durationDays}
                    onChange={(event) =>
                      update({
                        durationDays: Number(event.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-border border-t px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            className="gap-1"
            onClick={handleBack}
            disabled={stepIndex === 0}
          >
            <ChevronLeft className="size-4" aria-hidden />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="gap-1"
              onClick={handleNext}
              disabled={!canContinue}
            >
              {stepIndex === STEPS.length - 1 ? "Create campaign" : "Next"}
              {stepIndex < STEPS.length - 1 ? (
                <ChevronRight className="size-4" aria-hidden />
              ) : null}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
