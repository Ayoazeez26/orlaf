import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import { MOCK_SUBSCRIPTION_PLANS } from "../../data/mock-subscription-plans"
import type {
  EditPlanForm,
  PlanTierInterval,
  SubscriptionPlan,
} from "../../types"
import { EditPlanDialog } from "../edit-plan-dialog"
import { SubscriptionPlanCard } from "../subscription-plan-card"

type PlanDialogState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; plan: SubscriptionPlan }

function parseTierInterval(interval: string): PlanTierInterval {
  if (interval.includes("week")) return "week"
  if (interval.includes("year")) return "year"
  if (!interval.trim()) return "forever"
  return "month"
}

function formToPlan(
  form: EditPlanForm,
  existing?: SubscriptionPlan
): SubscriptionPlan {
  const slug =
    form.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `plan-${Date.now()}`

  return {
    id: existing?.id ?? slug,
    name: form.name,
    description: form.description,
    isLive: existing?.isLive ?? false,
    isMostPopular: existing?.isMostPopular,
    canDelete: existing?.canDelete ?? true,
    tiers: form.tiers.map((tier) => {
      const previous = existing?.tiers.find((item) => item.id === tier.id)
      const price = tier.price.startsWith("$") ? tier.price : `$${tier.price}`

      return {
        id: tier.id,
        label: tier.label,
        price,
        interval: parseTierInterval(tier.interval),
        sublabel: previous?.sublabel ?? "Billed monthly · Cancel anytime",
        isBestValue: tier.isBestValue,
        isSelected: tier.isBestValue,
        saveBadge: previous?.saveBadge,
      }
    }),
    includedFeatureIds: form.featureIds,
  }
}

export function SubscriptionsPlansTab() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(
    MOCK_SUBSCRIPTION_PLANS
  )
  const [planDialog, setPlanDialog] = useState<PlanDialogState>({
    mode: "closed",
  })
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(
    null
  )

  function updatePlanLive(id: string, isLive: boolean) {
    setPlans((current) =>
      current.map((plan) => (plan.id === id ? { ...plan, isLive } : plan))
    )
  }

  function deletePlan(id: string) {
    setPlans((current) => current.filter((plan) => plan.id !== id))
  }

  function handleSave(form: EditPlanForm) {
    if (planDialog.mode === "create") {
      setPlans((current) => [...current, formToPlan(form)])
      return
    }
    if (planDialog.mode === "edit") {
      setPlans((current) =>
        current.map((plan) =>
          plan.id === planDialog.plan.id
            ? formToPlan(form, planDialog.plan)
            : plan
        )
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-foreground text-lg tracking-tight">
            Subscription plans
          </h2>
          <p className="mt-1 text-muted-foreground text-sm">
            What viewers see when they upgrade in the Sable TV app.
          </p>
        </div>
        <Button
          type="button"
          className="gap-2"
          onClick={() => setPlanDialog({ mode: "create" })}
        >
          <Plus className="size-4" aria-hidden />
          New plan
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {plans.map((plan) => (
          <SubscriptionPlanCard
            key={plan.id}
            plan={plan}
            onLiveChange={(isLive) => updatePlanLive(plan.id, isLive)}
            onEdit={() => setPlanDialog({ mode: "edit", plan })}
            onDelete={plan.canDelete ? () => setPlanToDelete(plan) : undefined}
          />
        ))}
      </div>

      <EditPlanDialog
        open={planDialog.mode !== "closed"}
        onOpenChange={(open) => {
          if (!open) setPlanDialog({ mode: "closed" })
        }}
        mode={planDialog.mode === "create" ? "create" : "edit"}
        plan={planDialog.mode === "edit" ? planDialog.plan : null}
        onSave={handleSave}
      />

      <ConfirmDeleteDialog
        open={planToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPlanToDelete(null)
        }}
        title={`Delete ${planToDelete?.name ?? "plan"}?`}
        description="This plan will be removed from the list. Viewers will no longer see it."
        confirmLabel="Delete plan"
        onConfirm={() => {
          if (!planToDelete) return
          deletePlan(planToDelete.id)
          setPlanToDelete(null)
        }}
      />
    </div>
  )
}
