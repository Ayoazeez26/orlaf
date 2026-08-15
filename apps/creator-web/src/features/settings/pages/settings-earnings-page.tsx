import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Switch } from "@workspace/ui/components/switch"
import { Pencil, Plus, Star, Trash2 } from "lucide-react"
import { useState } from "react"
import { SettingsSectionCard } from "../components/settings-section-card"
import { PAYOUT_THRESHOLD_OPTIONS } from "../constants"
import { MOCK_SETTINGS_DASHBOARD } from "../data/mock-settings"
import type { PayoutMethod } from "../types"

/** Earnings remains demo UI until a revenue API exists. */
const MOCK_EARNINGS = MOCK_SETTINGS_DASHBOARD.earnings

export function SettingsEarningsPage() {
  const [autoPayout, setAutoPayout] = useState(MOCK_EARNINGS.autoPayoutEnabled)
  const [threshold, setThreshold] = useState(MOCK_EARNINGS.minimumThreshold)

  const earnings = MOCK_EARNINGS

  return (
    <div className="space-y-6">
      <SettingsSectionCard
        title="Wallet"
        description="Earnings accumulate here. Payouts run on the 1st of each month."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard
            label="Wallet Balance"
            value={earnings.walletBalance}
            large
          />
          <StatCard
            label="Pending This Cycle"
            value={earnings.pendingThisCycle}
          />
          <StatCard label="Next Payout" value={earnings.nextPayout} />
        </div>

        <div className="mt-5 space-y-4 border-border border-t pt-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-foreground text-sm">
                Auto-payout on the 1st
              </p>
              <p className="text-muted-foreground text-sm">
                Send earnings to your primary method automatically
              </p>
            </div>
            <Switch
              checked={autoPayout}
              onCheckedChange={setAutoPayout}
              aria-label="Auto-payout on the 1st"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-foreground text-sm">
                Minimum payout threshold
              </p>
              <p className="text-muted-foreground text-sm">
                Payouts below this amount roll over to the next cycle
              </p>
            </div>
            <Select value={threshold} onValueChange={setThreshold}>
              <SelectTrigger className="h-10 w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYOUT_THRESHOLD_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard
        title="Payout method"
        description="Choose how you want to be paid. Supports African & global rails."
        headerAction={
          <Button type="button" size="sm" className="gap-1.5 rounded-lg">
            <Plus className="size-3.5" aria-hidden />
            Add payout method
          </Button>
        }
      >
        <div className="divide-y rounded-xl border border-border">
          {earnings.payoutMethods.map((method) => (
            <PayoutMethodRow key={method.id} method={method} />
          ))}
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard
        title="Tax & deductions"
        description="No uploads needed — Sable handles withholding for your region."
      >
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="font-medium text-foreground text-sm">
            Estimated deductions on next payout
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Gross earnings</dt>
              <dd className="text-foreground">{earnings.grossEarnings}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">
                Withholding tax (5% · NG)
              </dt>
              <dd className="text-foreground">- {earnings.withholdingTax}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Processing fee</dt>
              <dd className="text-foreground">- {earnings.processingFee}</dd>
            </div>
            <div className="flex justify-between gap-4 border-border border-t pt-2 font-semibold">
              <dt className="text-foreground">Estimated net</dt>
              <dd className="text-foreground">{earnings.estimatedNet}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-foreground text-sm">Tax residency</p>
            <p className="text-muted-foreground text-sm">
              Used to calculate withholding on payouts
            </p>
          </div>
          <Select defaultValue={earnings.taxResidency}>
            <SelectTrigger className="h-10 w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={earnings.taxResidency}>
                {earnings.taxResidency}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SettingsSectionCard>
    </div>
  )
}

function StatCard({
  label,
  value,
  large = false,
}: {
  label: string
  value: string
  large?: boolean
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p
        className={
          large
            ? "mt-1 font-semibold text-2xl text-foreground"
            : "mt-1 font-semibold text-foreground text-lg"
        }
      >
        {value}
      </p>
    </div>
  )
}

function PayoutMethodRow({ method }: { method: PayoutMethod }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-foreground text-sm">{method.name}</p>
          {method.badges.map((badge) => (
            <Badge
              key={badge}
              variant="outline"
              className={
                badge === "PRIMARY"
                  ? "border-transparent bg-emerald-500/15 text-emerald-600 text-xs"
                  : "border-transparent bg-muted text-muted-foreground text-xs"
              }
            >
              {badge}
            </Badge>
          ))}
        </div>
        <p className="mt-0.5 text-muted-foreground text-xs">{method.details}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {!method.isPrimary ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            aria-label={`Set ${method.name} as primary`}
          >
            <Star className="size-4" aria-hidden />
          </Button>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          aria-label={`Edit ${method.name}`}
        >
          <Pencil className="size-4" aria-hidden />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          aria-label={`Delete ${method.name}`}
        >
          <Trash2 className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  )
}
