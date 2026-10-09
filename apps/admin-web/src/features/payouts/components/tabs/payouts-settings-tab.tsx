import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Switch } from "@workspace/ui/components/switch"
import { cn } from "@workspace/ui/lib/utils"
import { useEffect, useState } from "react"
import {
  useAdminRevenueSplit,
  useUpdatePlatformPayoutSettings,
} from "@/features/revenue-split/api/revenue-split-hooks"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { toast, toastMutationError } from "@/lib/toast"
import { PAYOUT_CADENCE_OPTIONS } from "../../constants"
import { DEFAULT_PAYOUT_SETTINGS } from "../../data/payout-analytics"
import type { PayoutSettings } from "../../types"

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

function SettingsSection({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="font-semibold text-base text-foreground tracking-tight">
          {title}
        </h3>
        <p className="mt-0.5 text-muted-foreground text-sm">{subtitle}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  )
}

export function PayoutsSettingsTab() {
  const { data, isLoading } = useAdminRevenueSplit()
  const updateSettings = useUpdatePlatformPayoutSettings()
  const [settings, setSettings] = useState<PayoutSettings>(
    DEFAULT_PAYOUT_SETTINGS
  )

  useEffect(() => {
    if (!data) return
    setSettings((current) => ({
      ...current,
      minimumPayoutThreshold: data.settings.minimumPayoutMinor / 100,
      holdPeriodDays: data.settings.holdPeriodDays,
      autoPayoutsEnabled: data.settings.autoPayoutsEnabled,
    }))
  }, [data])

  function update(patch: Partial<PayoutSettings>) {
    setSettings((current) => ({ ...current, ...patch }))
  }

  function handleSave() {
    updateSettings.mutate(
      {
        holdPeriodDays: settings.holdPeriodDays,
        minimumPayoutMinor: Math.round(settings.minimumPayoutThreshold * 100),
        autoPayoutsEnabled: settings.autoPayoutsEnabled,
      },
      {
        onSuccess: () => toast.success("Payout settings saved"),
        onError: (error) =>
          toastMutationError(error, "Unable to save payout settings"),
      }
    )
  }

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="space-y-8 px-4 sm:px-6">
        <SettingsSection
          title="Revenue share"
          subtitle="How earnings split between Sable TV and creators."
        >
          <SettingsField
            label="Default creator share (%)"
            hint="Not yet connected — manage verified/top/exclusive tiers in Revenue Split instead."
          >
            <Input
              type="number"
              min={0}
              max={100}
              value={settings.defaultCreatorShare}
              onChange={(event) =>
                update({ defaultCreatorShare: Number(event.target.value) })
              }
              className="h-9"
              disabled
            />
          </SettingsField>
          <SettingsField
            label="Verified creator share (%)"
            hint="Not yet connected — manage in the Revenue Split tab."
          >
            <Input
              type="number"
              min={0}
              max={100}
              value={settings.verifiedCreatorShare}
              onChange={(event) =>
                update({ verifiedCreatorShare: Number(event.target.value) })
              }
              className="h-9"
              disabled
            />
          </SettingsField>
          <SettingsField label="Minimum payout threshold">
            <Input
              type="text"
              value={`₦${settings.minimumPayoutThreshold.toLocaleString("en-NG")}`}
              onChange={(event) => {
                const raw = event.target.value.replace(/[^\d]/g, "")
                update({
                  minimumPayoutThreshold: raw ? Number(raw) : 0,
                })
              }}
              className="h-9"
            />
          </SettingsField>
        </SettingsSection>

        <div className="border-border border-t" />

        <SettingsSection
          title="Schedule"
          subtitle="When earnings are paid out."
        >
          <SettingsField
            label="Payout cadence"
            hint="Not yet connected — no backend field exists for this yet."
          >
            <Select
              value={settings.payoutCadence}
              onValueChange={(value) => update({ payoutCadence: value })}
              disabled
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYOUT_CADENCE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingsField>
          <SettingsField
            label="Hold period (days)"
            hint="Time before earnings become withdrawable."
          >
            <Input
              type="number"
              min={0}
              value={settings.holdPeriodDays}
              onChange={(event) =>
                update({ holdPeriodDays: Number(event.target.value) })
              }
              className="h-9"
            />
          </SettingsField>
        </SettingsSection>

        <div className="flex items-center justify-between border-border border-t pt-6">
          <SettingsField
            label="Automatic payouts"
            hint="Disburse eligible payouts automatically each cycle."
          >
            <Switch
              checked={settings.autoPayoutsEnabled}
              onCheckedChange={(checked) =>
                update({ autoPayoutsEnabled: checked })
              }
              aria-label="Enable automatic payouts"
            />
          </SettingsField>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading || updateSettings.isPending}
          >
            {updateSettings.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
