import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { ImageIcon, Upload } from "lucide-react"
import { useState } from "react"
import {
  SettingsDivider,
  SettingsField,
  SettingsPanel,
  SettingsSection,
  ToggleField,
} from "../settings-shared"

export function SettingsBrandingTab() {
  const [primaryColor, setPrimaryColor] = useState("#5517A5")
  const [accentColor, setAccentColor] = useState("#F5F0FF")
  const [darkModeDefault, setDarkModeDefault] = useState(true)

  return (
    <SettingsPanel>
      <SettingsSection
        title="Identity"
        subtitle="How Sable TV looks across the main app and shareable links."
      >
        <SettingsField label="Logo">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
              S
            </span>
            <Button type="button" variant="outline" size="sm" className="gap-2">
              <Upload className="size-4" aria-hidden />
              Upload
            </Button>
            <button
              type="button"
              className="text-muted-foreground text-sm hover:text-foreground"
            >
              Remove
            </button>
          </div>
        </SettingsField>
        <SettingsField
          label="App icon"
          hint="Used on mobile home screens (1024×1024 PNG)."
        >
          <Button type="button" variant="outline" size="sm" className="gap-2">
            <Upload className="size-4" aria-hidden />
            Upload icon
          </Button>
        </SettingsField>
        <SettingsField
          label="Default share image"
          hint="Falls back when a series has no thumbnail."
        >
          <Button type="button" variant="outline" size="sm" className="gap-2">
            <ImageIcon className="size-4" aria-hidden />
            Upload image
          </Button>
        </SettingsField>
      </SettingsSection>

      <SettingsDivider />

      <SettingsSection
        title="Color"
        subtitle="Used for buttons, highlights, and rails across the main app."
      >
        <SettingsField label="Primary">
          <div className="flex items-center gap-2">
            <span
              className="size-9 shrink-0 rounded-lg border border-border"
              style={{ backgroundColor: primaryColor }}
            />
            <Input
              value={primaryColor}
              onChange={(event) => setPrimaryColor(event.target.value)}
              className="h-9"
            />
          </div>
        </SettingsField>
        <SettingsField label="Accent">
          <div className="flex items-center gap-2">
            <span
              className={cn("size-9 shrink-0 rounded-lg border border-border")}
              style={{ backgroundColor: accentColor }}
            />
            <Input
              value={accentColor}
              onChange={(event) => setAccentColor(event.target.value)}
              className="h-9"
            />
          </div>
        </SettingsField>
        <ToggleField
          label="Dark mode default"
          hint="Open the main app in dark theme by default."
          checked={darkModeDefault}
          onCheckedChange={setDarkModeDefault}
        />
      </SettingsSection>
    </SettingsPanel>
  )
}
