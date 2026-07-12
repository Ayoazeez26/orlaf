import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useState } from "react"
import { LANGUAGE_OPTIONS, REGION_OPTIONS } from "../../constants"
import {
  SettingsDivider,
  SettingsField,
  SettingsPanel,
  SettingsSection,
  ToggleField,
} from "../settings-shared"

export function SettingsGeneralTab() {
  const [platformName, setPlatformName] = useState("Sable TV")
  const [tagline, setTagline] = useState("Short-form series, big stories.")
  const [supportEmail, setSupportEmail] = useState("help@sable.tv")
  const [region, setRegion] = useState("Nigeria (NGN)")
  const [language, setLanguage] = useState("English")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [pauseSignups, setPauseSignups] = useState(false)

  return (
    <SettingsPanel>
      <SettingsSection
        title="Platform"
        subtitle="The basics shown across the admin and main app."
      >
        <SettingsField label="Platform name">
          <Input
            value={platformName}
            onChange={(event) => setPlatformName(event.target.value)}
            className="h-9"
          />
        </SettingsField>
        <SettingsField
          label="Tagline"
          hint="One-line description used on shareable links."
        >
          <Input
            value={tagline}
            onChange={(event) => setTagline(event.target.value)}
            className="h-9"
          />
        </SettingsField>
        <SettingsField label="Support email">
          <Input
            type="email"
            value={supportEmail}
            onChange={(event) => setSupportEmail(event.target.value)}
            className="h-9"
          />
        </SettingsField>
        <SettingsField
          label="Primary region"
          hint="Used for default scheduling and currency."
        >
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REGION_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField label="Default language">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>
      </SettingsSection>

      <SettingsDivider />

      <SettingsSection
        title="Status"
        subtitle="Take parts of the platform offline for maintenance."
      >
        <ToggleField
          label="Maintenance mode"
          hint="Main app shows a friendly maintenance page. Admin stays online."
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
    </SettingsPanel>
  )
}
