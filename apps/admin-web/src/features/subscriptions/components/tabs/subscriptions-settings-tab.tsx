import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { useAdminSubscriptionSettings } from "../../api/subscriptions-hooks"

interface SettingsFieldProps {
  label: string
  hint?: string
  children: React.ReactNode
}

function SettingsField({ label, hint, children }: SettingsFieldProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,220px)] sm:items-center sm:gap-6">
      <div>
        <Label className="font-medium text-foreground text-sm">{label}</Label>
        {hint ? (
          <p className="mt-0.5 text-muted-foreground text-xs">{hint}</p>
        ) : null}
      </div>
      <div>{children}</div>
    </div>
  )
}

function ToggleField({
  label,
  hint,
  checked,
}: {
  label: string
  hint: string
  checked: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <Label className="font-medium text-foreground text-sm">{label}</Label>
        <p className="mt-0.5 text-muted-foreground text-xs">{hint}</p>
      </div>
      <Switch checked={checked} disabled />
    </div>
  )
}

export function SubscriptionsSettingsTab() {
  const { data: settings } = useAdminSubscriptionSettings()

  if (!settings) return null

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="space-y-6 px-4 sm:px-6">
        <div>
          <h3 className="font-semibold text-base text-foreground tracking-tight">
            Trial & billing
          </h3>
          <p className="mt-0.5 text-muted-foreground text-sm">
            Read-only reference. Trials, grace periods, and SKUs are configured
            in RevenueCat and the app stores — not in Sable admin.
          </p>
        </div>

        <div className="space-y-5">
          <SettingsField
            label="Free trial length (days)"
            hint="Set to 0 to disable trials."
          >
            <Input
              type="number"
              value={settings.free_trial_days}
              readOnly
              disabled
              className="h-9"
            />
          </SettingsField>
          <SettingsField
            label="Annual discount (%)"
            hint="Applied when viewers pay yearly."
          >
            <Input
              type="number"
              value={settings.annual_discount_percent}
              readOnly
              disabled
              className="h-9"
            />
          </SettingsField>
          <SettingsField
            label="Grace period (days)"
            hint="Keep access after a failed renewal payment."
          >
            <Input
              type="number"
              value={settings.grace_period_days}
              readOnly
              disabled
              className="h-9"
            />
          </SettingsField>
          <ToggleField
            label="Allow plan changes mid-cycle"
            hint="Prorate the difference when viewers upgrade or downgrade."
            checked={settings.allow_plan_changes_mid_cycle}
          />
          <ToggleField
            label="Send renewal reminder email"
            hint="Notify viewers 3 days before their plan renews."
            checked={settings.send_renewal_reminder_email}
          />
        </div>
      </CardContent>
    </Card>
  )
}
