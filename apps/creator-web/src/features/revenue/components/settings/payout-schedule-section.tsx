import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Calendar, Check, Info } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { toast, toastMutationError } from "@/lib/toast"
import { useUpdatePayoutFrequency } from "../../hooks/use-revenue-dashboard"
import type { PayoutSchedule } from "../../types"

interface PayoutScheduleSectionProps {
  schedule: PayoutSchedule
  className?: string
}

export function PayoutScheduleSection({
  schedule,
  className,
}: PayoutScheduleSectionProps) {
  const updateFrequency = useUpdatePayoutFrequency()

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold text-foreground">Payout Schedule</p>
          {schedule.isActive && (
            <Badge
              variant="outline"
              className="gap-1 border-border bg-card font-normal text-foreground dark:bg-muted"
            >
              <Check className="size-3" aria-hidden />
              Active
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          Your earnings are automatically paid out on a regular schedule. Choose
          a frequency below.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FrequencyCard
            label="Monthly"
            description="1st of each month"
            selected={schedule.frequency === "monthly"}
            onSelect={() =>
              updateFrequency.mutate("monthly", {
                onSuccess: () =>
                  toast.success("Payout schedule set to monthly."),
                onError: (error) =>
                  toastMutationError(
                    error,
                    "Unable to update payout schedule."
                  ),
              })
            }
          />
          <FrequencyCard
            label="Quarterly"
            description="1st of Jan, Apr, Jul, Oct"
            selected={schedule.frequency === "quarterly"}
            onSelect={() =>
              updateFrequency.mutate("quarterly", {
                onSuccess: () =>
                  toast.success("Payout schedule set to quarterly."),
                onError: (error) =>
                  toastMutationError(
                    error,
                    "Unable to update payout schedule."
                  ),
              })
            }
          />
        </div>

        <div className="flex gap-3 rounded-xl border border-payout-schedule-info-border bg-payout-schedule-info-bg p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <p className="text-muted-foreground text-sm">
            Your next payout of {schedule.nextPayoutAmount} will be sent on{" "}
            {schedule.nextPayoutDate} to your primary payment method.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function FrequencyCard({
  label,
  description,
  selected,
  onSelect,
}: {
  label: string
  description: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
        selected
          ? "border-payout-schedule-selected-border bg-payout-schedule-selected-bg"
          : "border-border bg-card hover:border-payout-schedule-selected-border/50"
      )}
    >
      <Calendar
        className={cn(
          "size-5",
          selected ? "text-primary" : "text-muted-foreground"
        )}
        strokeWidth={2}
        aria-hidden
      />
      <span className="font-semibold text-foreground text-sm">{label}</span>
      <span className="text-muted-foreground text-sm">{description}</span>
    </button>
  )
}
