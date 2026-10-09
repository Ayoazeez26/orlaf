import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Loader2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast, toastMutationError } from "@/lib/toast"
import {
  useGeneralSettingsQuery,
  useUpdateGeneralSettings,
} from "../../api/general-settings-hooks"
import { registerSettingsSave } from "../../lib/settings-form-actions"
import {
  SettingsDivider,
  SettingsField,
  SettingsPanel,
  SettingsSection,
  ToggleField,
} from "../settings-shared"

export function SettingsGeneralTab() {
  const { data, isLoading } = useGeneralSettingsQuery()
  const updateSettings = useUpdateGeneralSettings()

  const [tagline, setTagline] = useState("")
  const [supportEmail, setSupportEmail] = useState("")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [pauseSignups, setPauseSignups] = useState(false)

  useEffect(() => {
    if (!data) return
    setTagline(data.tagline)
    setSupportEmail(data.supportEmail)
    setMaintenanceMode(data.maintenanceMode)
    setPauseSignups(data.pauseSignups)
  }, [data])

  const handleSave = useCallback(() => {
    updateSettings.mutate(
      { tagline, supportEmail, maintenanceMode, pauseSignups },
      {
        onSuccess: () => toast.success("General settings saved"),
        onError: (error) =>
          toastMutationError(error, "Unable to save general settings"),
      }
    )
  }, [tagline, supportEmail, maintenanceMode, pauseSignups, updateSettings])

  useEffect(() => registerSettingsSave(handleSave), [handleSave])

  return (
    <SettingsPanel>
      <SettingsSection
        title="Platform"
        subtitle="The basics shown across the admin and main app."
      >
        <SettingsField
          label="Platform name"
          hint="Not editable here — contact engineering to change."
        >
          <Input value={data?.platformName ?? ""} disabled className="h-9" />
        </SettingsField>
        <SettingsField
          label="Tagline"
          hint="One-line description used on shareable links."
        >
          <Input
            value={tagline}
            onChange={(event) => setTagline(event.target.value)}
            disabled={isLoading}
            className="h-9"
          />
        </SettingsField>
        <SettingsField label="Support email">
          <Input
            type="email"
            value={supportEmail}
            onChange={(event) => setSupportEmail(event.target.value)}
            disabled={isLoading}
            className="h-9"
          />
        </SettingsField>
        <SettingsField
          label="Primary region"
          hint="Not editable here — contact engineering to change."
        >
          <Input value={data?.primaryRegion ?? ""} disabled className="h-9" />
        </SettingsField>
        <SettingsField
          label="Default language"
          hint="Not editable here — contact engineering to change."
        >
          <Input value={data?.defaultLanguage ?? ""} disabled className="h-9" />
        </SettingsField>
      </SettingsSection>

      <SettingsDivider />

      <SettingsSection
        title="Status"
        subtitle="Take parts of the platform offline for maintenance."
      >
        <ToggleField
          label="Maintenance mode"
          hint="Creator web and mobile show a maintenance page. Admin stays online."
          checked={maintenanceMode}
          onCheckedChange={setMaintenanceMode}
        />
        <ToggleField
          label="Pause new sign-ups"
          hint="Block creator and viewer registrations temporarily."
          checked={pauseSignups}
          onCheckedChange={setPauseSignups}
        />
      </SettingsSection>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isLoading || updateSettings.isPending}
        >
          {updateSettings.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </SettingsPanel>
  )
}
