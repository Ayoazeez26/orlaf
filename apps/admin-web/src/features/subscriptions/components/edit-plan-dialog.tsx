import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react"
import { useEffect, useState } from "react"
import { PLAN_FEATURES } from "../constants"
import type { EditPlanForm, EditPlanTier, SubscriptionPlan } from "../types"
import { useModalShell } from "./use-modal-shell"

type WizardStep = "basics" | "pricing" | "features"

const STEPS: { id: WizardStep; label: string; number: number }[] = [
  { id: "basics", label: "Basics", number: 1 },
  { id: "pricing", label: "Pricing", number: 2 },
  { id: "features", label: "Features", number: 3 },
]

function emptyPlanForm(): EditPlanForm {
  return {
    name: "",
    description: "",
    tiers: [
      {
        id: `tier-${Date.now()}`,
        label: "Monthly",
        price: "0",
        interval: "/ month",
        isBestValue: true,
      },
    ],
    featureIds: [],
  }
}

function planToForm(plan: SubscriptionPlan): EditPlanForm {
  return {
    name: plan.name,
    description: plan.description,
    tiers: plan.tiers.map((tier) => ({
      id: tier.id,
      label: tier.label,
      price: tier.price.replace("$", ""),
      interval:
        tier.interval === "forever"
          ? ""
          : `/ ${tier.interval === "week" ? "week" : tier.interval === "month" ? "month" : "year"}`,
      isBestValue: tier.isBestValue ?? false,
    })),
    featureIds: [...plan.includedFeatureIds],
  }
}

interface EditPlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: SubscriptionPlan | null
  mode?: "create" | "edit"
  onSave?: (form: EditPlanForm) => void
}

export function EditPlanDialog({
  open,
  onOpenChange,
  plan,
  mode = "edit",
  onSave,
}: EditPlanDialogProps) {
  const [step, setStep] = useState<WizardStep>("basics")
  const [form, setForm] = useState<EditPlanForm | null>(null)

  useEffect(() => {
    if (!open) return
    if (mode === "create") {
      setForm(emptyPlanForm())
      setStep("basics")
      return
    }
    if (!plan) return
    setForm(planToForm(plan))
    setStep("basics")
  }, [open, plan, mode])

  useModalShell(open, onOpenChange)

  if (!open || !form) return null
  if (mode === "edit" && !plan) return null

  const stepIndex = STEPS.findIndex((item) => item.id === step)

  function updateForm(patch: Partial<EditPlanForm>) {
    setForm((current) => (current ? { ...current, ...patch } : current))
  }

  function updateTier(id: string, patch: Partial<EditPlanTier>) {
    setForm((current) =>
      current
        ? {
            ...current,
            tiers: current.tiers.map((tier) =>
              tier.id === id ? { ...tier, ...patch } : tier
            ),
          }
        : current
    )
  }

  function setBestValue(id: string) {
    setForm((current) =>
      current
        ? {
            ...current,
            tiers: current.tiers.map((tier) => ({
              ...tier,
              isBestValue: tier.id === id,
            })),
          }
        : current
    )
  }

  function addTier() {
    setForm((current) =>
      current
        ? {
            ...current,
            tiers: [
              ...current.tiers,
              {
                id: `tier-${Date.now()}`,
                label: "New tier",
                price: "0",
                interval: "/ month",
                isBestValue: false,
              },
            ],
          }
        : current
    )
  }

  function removeTier(id: string) {
    setForm((current) =>
      current
        ? {
            ...current,
            tiers: current.tiers.filter((tier) => tier.id !== id),
          }
        : current
    )
  }

  function toggleFeature(featureId: string) {
    setForm((current) => {
      if (!current) return current
      const included = current.featureIds.includes(featureId)
      return {
        ...current,
        featureIds: included
          ? current.featureIds.filter((id) => id !== featureId)
          : [...current.featureIds, featureId],
      }
    })
  }

  function handleNext() {
    if (stepIndex < STEPS.length - 1) {
      setStep(STEPS[stepIndex + 1]?.id)
      return
    }
    if (!form) return
    onSave?.(form)
    onOpenChange(false)
  }

  function handleBack() {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1]?.id)
  }

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
        aria-labelledby="edit-plan-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="edit-plan-title"
                className="font-semibold text-foreground text-lg"
              >
                {mode === "create" ? "New plan" : "Edit plan"}
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                {step === "basics"
                  ? "Name and describe what viewers get."
                  : step === "pricing"
                    ? "Add the prices viewers can pick from."
                    : "Choose which features are included."}
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
                    <span className="mx-1 text-muted-foreground/40">—</span>
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
                <Label htmlFor="plan-name">Plan name</Label>
                <Input
                  id="plan-name"
                  value={form.name}
                  onChange={(event) => updateForm({ name: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-description">Description</Label>
                <Textarea
                  id="plan-description"
                  value={form.description}
                  onChange={(event) =>
                    updateForm({ description: event.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
          ) : null}

          {step === "pricing" ? (
            <div className="space-y-4">
              {form.tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={cn(
                    "relative rounded-xl border p-4",
                    tier.isBestValue
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                >
                  {tier.isBestValue ? (
                    <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2.5 py-0.5 font-medium text-primary-foreground text-xs">
                      Best Value
                    </span>
                  ) : null}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Input
                      value={tier.label}
                      onChange={(event) =>
                        updateTier(tier.id, { label: event.target.value })
                      }
                      className="h-9"
                      aria-label="Tier label"
                    />
                    <div className="relative max-w-[120px]">
                      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground text-sm">
                        $
                      </span>
                      <Input
                        value={tier.price}
                        onChange={(event) =>
                          updateTier(tier.id, { price: event.target.value })
                        }
                        className="h-9 pl-7"
                        aria-label="Tier price"
                      />
                    </div>
                    <Input
                      value={tier.interval}
                      onChange={(event) =>
                        updateTier(tier.id, { interval: event.target.value })
                      }
                      className="h-9 max-w-[120px]"
                      aria-label="Billing interval"
                    />
                    <div className="flex items-center gap-1 sm:ml-auto">
                      <button
                        type="button"
                        onClick={() => setBestValue(tier.id)}
                        className={cn(
                          "flex size-9 items-center justify-center rounded-lg transition-colors",
                          tier.isBestValue
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted"
                        )}
                        aria-label="Mark as best value"
                      >
                        <Star
                          className={cn(
                            "size-4",
                            tier.isBestValue && "fill-current"
                          )}
                          aria-hidden
                        />
                      </button>
                      {form.tiers.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removeTier(tier.id)}
                          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-600"
                          aria-label="Remove tier"
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={addTier}
              >
                <Plus className="size-4" aria-hidden />
                Add another tier
              </Button>
              <p className="text-center text-muted-foreground text-xs">
                Tip: mark your most popular tier as Best Value to highlight it.
              </p>
            </div>
          ) : null}

          {step === "features" ? (
            <div className="space-y-3">
              {PLAN_FEATURES.map((feature) => {
                const Icon = feature.icon
                const checked = form.featureIds.includes(feature.id)

                return (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => toggleFeature(feature.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors hover:bg-muted/40",
                      checked
                        ? "border-primary/40 bg-primary/5"
                        : "border-border"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded border",
                        checked
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {checked ? (
                        <Check className="size-3" aria-hidden />
                      ) : null}
                    </span>
                    <Icon
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <span className="font-medium text-foreground text-sm">
                      {feature.label}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : null}
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
            <Button type="button" className="gap-1" onClick={handleNext}>
              {stepIndex === STEPS.length - 1
                ? mode === "create"
                  ? "Create plan"
                  : "Save"
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
