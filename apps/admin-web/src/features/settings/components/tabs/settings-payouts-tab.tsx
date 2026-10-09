import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useCallback, useEffect, useState } from "react"
import { PAYOUT_CADENCE_OPTIONS } from "@/features/payouts/constants"
import { DEFAULT_PAYOUT_SETTINGS } from "@/features/payouts/data/payout-analytics"
import type { PayoutSettings } from "@/features/payouts/types"
import {
  useAdminRevenueSplit,
  useUpdatePlatformPayoutSettings,
} from "@/features/revenue-split/api/revenue-split-hooks"
import { toast, toastMutationError } from "@/lib/toast"
import { registerSettingsSave } from "../../lib/settings-form-actions"
import {
  SettingsDivider,
  SettingsField,
  SettingsPanel,
  SettingsSection,
  ToggleField,
} from "../settings-shared"

export function SettingsPayoutsTab() {
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

  const handleSave = useCallback(() => {
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
  }, [settings, updateSettings])

  useEffect(() => registerSettingsSave(handleSave), [handleSave])

  return (
    <SettingsPanel>
      <SettingsSection
        title="Revenue share"
        subtitle="How earnings split between Sable TV and creators."
      >
        <SettingsField
          label="Default creator share (%)"
          hint="Not yet connected — manage verified/top/exclusive tiers in the Revenue Split feature instead."
        >
          <Input
            type="number"
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
          hint="Not yet connected — manage in the Revenue Split feature instead."
        >
          <Input
            type="number"
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

      <SettingsDivider />

      <SettingsSection title="Schedule" subtitle="When earnings are paid out.">
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
            value={settings.holdPeriodDays}
            onChange={(event) =>
              update({ holdPeriodDays: Number(event.target.value) })
            }
            className="h-9"
          />
        </SettingsField>
        <ToggleField
          label="Automatic payouts"
          hint="Disburse eligible payouts automatically each cycle."
          checked={settings.autoPayoutsEnabled}
          onCheckedChange={(checked) => update({ autoPayoutsEnabled: checked })}
        />
      </SettingsSection>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isLoading || updateSettings.isPending}
        >
          {updateSettings.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </SettingsPanel>
  )
}
