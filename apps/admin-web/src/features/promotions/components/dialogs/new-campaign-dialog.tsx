import type { PromotionGoal, PromotionPlacement } from "@sable/contracts"
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
import { Check, ChevronLeft, ChevronRight, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useProjectsQuery } from "@/features/projects/api/projects-hooks"
import {
  PROMOTION_GOAL_LABELS,
  PROMOTION_PLACEMENT_LABELS,
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
  seriesId: "",
  seriesTitle: "",
  creatorId: "",
  creatorName: "",
  goal: "views",
  placement: "home_banner",
  budget: 100_000,
  durationDays: 14,
}

interface NewCampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate?: (values: NewCampaignFormValues) => void
  isSubmitting?: boolean
}

export function NewCampaignDialog({
  open,
  onOpenChange,
  onCreate,
  isSubmitting,
}: NewCampaignDialogProps) {
  const [step, setStep] = useState<WizardStep>("basics")
  const [values, setValues] = useState<NewCampaignFormValues>(EMPTY_VALUES)
  const [seriesSearch, setSeriesSearch] = useState("")

  const { data: seriesData } = useProjectsQuery({
    filter: "all",
    pageSize: 20,
    q: seriesSearch,
  })

  useEffect(() => {
    if (!open) return
    setValues(EMPTY_VALUES)
    setSeriesSearch("")
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
  }

  function handleBack() {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1]?.id)
  }

  const canContinue =
    step === "basics"
      ? values.title.trim().length > 0 && values.seriesId.length > 0
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
                  ? "Name the campaign and pick the series to promote."
                  : "Choose the goal, placement, budget, and run length."}
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
                <Label htmlFor="campaign-series">Series</Label>
                {values.seriesId ? (
                  <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5">
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {values.seriesTitle}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {values.creatorName}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        update({
                          seriesId: "",
                          seriesTitle: "",
                          creatorId: "",
                          creatorName: "",
                        })
                      }
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search
                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                      />
                      <Input
                        id="campaign-series"
                        type="search"
                        value={seriesSearch}
                        onChange={(event) =>
                          setSeriesSearch(event.target.value)
                        }
                        placeholder="Search series..."
                        className="pl-9"
                      />
                    </div>
                    <ul className="max-h-48 space-y-1.5 overflow-y-auto">
                      {(seriesData?.items ?? []).map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            className="flex w-full items-center justify-between rounded-xl border border-border px-3 py-2.5 text-left hover:bg-muted/40"
                            onClick={() =>
                              update({
                                seriesId: item.id,
                                seriesTitle: item.title,
                                creatorId: item.creatorId,
                                creatorName: item.creatorName,
                              })
                            }
                          >
                            <div>
                              <p className="font-medium text-foreground text-sm">
                                {item.title}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {item.creatorName}
                              </p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-goal">Goal</Label>
                <Select
                  value={values.goal}
                  onValueChange={(goal) =>
                    update({ goal: goal as PromotionGoal })
                  }
                >
                  <SelectTrigger id="campaign-goal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROMOTION_GOAL_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-placement">Placement</Label>
                <Select
                  value={values.placement}
                  onValueChange={(placement) =>
                    update({ placement: placement as PromotionPlacement })
                  }
                >
                  <SelectTrigger id="campaign-placement">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROMOTION_PLACEMENT_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
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
              disabled={!canContinue || isSubmitting}
            >
              {stepIndex === STEPS.length - 1
                ? isSubmitting
                  ? "Creating…"
                  : "Create campaign"
                : "Next"}
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
