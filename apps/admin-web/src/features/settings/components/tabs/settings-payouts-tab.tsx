import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useState } from "react"
import { PAYOUT_CADENCE_OPTIONS } from "@/features/payouts/constants"
import { DEFAULT_PAYOUT_SETTINGS } from "@/features/payouts/data/payout-analytics"
import type { PayoutSettings } from "@/features/payouts/types"
import {
  SettingsDivider,
  SettingsField,
  SettingsPanel,
  SettingsSection,
  ToggleField,
} from "../settings-shared"

export function SettingsPayoutsTab() {
  const [settings, setSettings] = useState<PayoutSettings>(
    DEFAULT_PAYOUT_SETTINGS
  )

  function update(patch: Partial<PayoutSettings>) {
    setSettings((current) => ({ ...current, ...patch }))
  }

  return (
    <SettingsPanel>
      <SettingsSection
        title="Revenue share"
        subtitle="How earnings split between Sable TV and creators."
      >
        <SettingsField label="Default creator share (%)">
          <Input
            type="number"
            value={settings.defaultCreatorShare}
            onChange={(event) =>
              update({ defaultCreatorShare: Number(event.target.value) })
            }
            className="h-9"
          />
        </SettingsField>
        <SettingsField
          label="Verified creator share (%)"
          hint="Bonus share for verified creators."
        >
          <Input
            type="number"
            value={settings.verifiedCreatorShare}
            onChange={(event) =>
              update({ verifiedCreatorShare: Number(event.target.value) })
            }
            className="h-9"
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
        <SettingsField label="Payout cadence">
          <Select
            value={settings.payoutCadence}
            onValueChange={(value) => update({ payoutCadence: value })}
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
          label="Email payout receipts"
          hint="Send creators a breakdown each cycle."
          checked={settings.autoPayoutsEnabled}
          onCheckedChange={(checked) => update({ autoPayoutsEnabled: checked })}
        />
      </SettingsSection>
    </SettingsPanel>
  )
}
