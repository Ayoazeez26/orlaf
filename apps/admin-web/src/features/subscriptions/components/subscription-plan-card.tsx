import { Card, CardContent } from "@workspace/ui/components/card"
import { Switch } from "@workspace/ui/components/switch"
import { cn } from "@workspace/ui/lib/utils"
import { Check, Crown, Pencil, Trash2, X } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { PLAN_FEATURES } from "../constants"
import type { PlanTier, SubscriptionPlan } from "../types"

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan
  onLiveChange: (isLive: boolean) => void
  onEdit: () => void
  onDelete?: () => void
}

function formatInterval(interval: PlanTier["interval"]) {
  switch (interval) {
    case "week":
      return "/week"
    case "month":
      return "/month"
    case "year":
      return "/year"
    default:
      return ""
  }
}

export function SubscriptionPlanCard({
  plan,
  onLiveChange,
  onEdit,
  onDelete,
}: SubscriptionPlanCardProps) {
  const isPremium = plan.id !== "free"
  const featureColumnLabel = isPremium ? "PRO" : "FREE"

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "flex flex-col py-6")}>
      <CardContent className="flex flex-1 flex-col gap-5 px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                isPremium
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Crown className="size-5" aria-hidden />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-foreground text-lg tracking-tight">
                  {plan.name}
                </h3>
                {plan.isMostPopular ? (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
                    Most popular
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-muted-foreground text-sm">
                {plan.description}
              </p>
            </div>
          </div>
          {plan.isLive ? (
            <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-medium text-emerald-600 text-xs">
              Live
            </span>
          ) : null}
        </div>

        <div className="space-y-3">
          {plan.tiers.map((tier) => (
            <TierOption key={tier.id} tier={tier} />
          ))}
        </div>

        <div className="mt-auto overflow-hidden rounded-xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-border border-b bg-muted/30">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Feature
                </th>
                <th className="px-4 py-2.5 text-center font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  <span className="inline-flex items-center gap-1">
                    {isPremium ? (
                      <Crown className="size-3 text-primary" aria-hidden />
                    ) : null}
                    {featureColumnLabel}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {PLAN_FEATURES.map((feature) => {
                const Icon = feature.icon
                const included = plan.includedFeatureIds.includes(feature.id)

                return (
                  <tr
                    key={feature.id}
                    className="border-border/60 border-b last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5 text-foreground">
                        <Icon
                          className="size-4 shrink-0 text-muted-foreground"
                          aria-hidden
                        />
                        <span>{feature.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {included ? (
                        <Check
                          className="mx-auto size-4 text-primary"
                          aria-label="Included"
                        />
                      ) : (
                        <X
                          className="mx-auto size-4 text-muted-foreground/60"
                          aria-label="Not included"
                        />
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3 border-border border-t pt-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={plan.isLive}
              onCheckedChange={onLiveChange}
              aria-label={`${plan.name} live status`}
            />
            <span className="font-medium text-foreground text-sm">Live</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={`Edit ${plan.name}`}
            >
              <Pencil className="size-4" aria-hidden />
            </button>
            {plan.canDelete && onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-600"
                aria-label={`Delete ${plan.name}`}
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TierOption({ tier }: { tier: PlanTier }) {
  const isSelected = tier.isSelected

  return (
    <div
      className={cn(
        "relative rounded-xl border p-4 transition-colors",
        isSelected ? "border-primary bg-primary/5" : "border-border"
      )}
    >
      {tier.isBestValue ? (
        <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2.5 py-0.5 font-medium text-primary-foreground text-xs">
          Best Value
        </span>
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-foreground">{tier.label}</p>
            {tier.saveBadge ? (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
                {tier.saveBadge}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-muted-foreground text-xs">
            {tier.sublabel}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-semibold text-foreground text-lg tabular-nums">
            {tier.price}
            {tier.interval !== "forever" ? (
              <span className="font-normal text-muted-foreground text-sm">
                {formatInterval(tier.interval)}
              </span>
            ) : null}
          </p>
          <span
            className={cn(
              "flex size-4 shrink-0 items-center justify-center rounded-full border-2",
              isSelected
                ? "border-primary bg-primary"
                : "border-muted-foreground/30"
            )}
            aria-hidden
          >
            {isSelected ? (
              <span className="size-1.5 rounded-full bg-primary-foreground" />
            ) : null}
          </span>
        </div>
      </div>
    </div>
  )
}
