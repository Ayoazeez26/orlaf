import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Switch } from "@workspace/ui/components/switch"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import {
  LANGUAGE_OPTIONS,
  TIMEZONE_OPTIONS,
  VISIBILITY_OPTIONS,
} from "../constants"
import { useSettingsDashboard } from "../hooks/use-settings-dashboard"

export function SettingsPreferencesPage() {
  const { data } = useSettingsDashboard()
  const [prefs, setPrefs] = useState(data?.preferences)
  if (!data || !prefs) return null

  function updatePrefs(patch: Partial<typeof prefs>) {
    setPrefs((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Card className={FROSTED_CARD_SURFACE_CLASS}>
        <CardHeader>
          <p className="font-semibold text-foreground">Content Defaults</p>
          <p className="text-muted-foreground text-sm">
            Default settings for new series and episodes
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-4 border-b pb-4 sm:grid-cols-2">
            <SelectField
              label="Default Language"
              value={prefs.defaultLanguage}
              onChange={(v) => updatePrefs({ defaultLanguage: v })}
              options={LANGUAGE_OPTIONS}
            />
            <SelectField
              label="Default Visibility"
              value={prefs.defaultVisibility}
              onChange={(v) => updatePrefs({ defaultVisibility: v })}
              options={VISIBILITY_OPTIONS}
            />
          </div>
          <ToggleRow
            title="Enable comments by default"
            description="Allow viewers to comment on new episodes"
            checked={prefs.commentsEnabledByDefault}
            onChange={(v) => updatePrefs({ commentsEnabledByDefault: v })}
          />
          <ToggleRow
            title="Auto-publish after processing"
            description="Automatically publish episodes once encoding completes"
            checked={prefs.autoPublishAfterProcessing}
            onChange={(v) => updatePrefs({ autoPublishAfterProcessing: v })}
          />
          <ToggleRow
            title="Enable tipping by default"
            description="Let viewers send tips on your content"
            checked={prefs.tippingEnabledByDefault}
            onChange={(v) => updatePrefs({ tippingEnabledByDefault: v })}
          />
        </CardContent>
      </Card>

      <Card className={FROSTED_CARD_SURFACE_CLASS}>
        <CardHeader>
          <p className="font-semibold text-foreground">
            Display &amp; Accessibility
          </p>
          <p className="text-muted-foreground text-sm">
            Customize your dashboard experience
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-4 border-b pb-4 sm:grid-cols-2">
            <SelectField
              label="Dashboard Language"
              value={prefs.dashboardLanguage}
              onChange={(v) => updatePrefs({ dashboardLanguage: v })}
              options={LANGUAGE_OPTIONS}
            />
            <SelectField
              label="Timezone"
              value={prefs.timezone}
              onChange={(v) => updatePrefs({ timezone: v })}
              options={TIMEZONE_OPTIONS}
            />
          </div>
          <ToggleRow
            title="Reduced motion"
            description="Minimize animations throughout the dashboard"
            checked={prefs.reducedMotion}
            onChange={(v) => updatePrefs({ reducedMotion: v })}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly string[]
}) {
  return (
    <div className="min-w-0 space-y-2">
      <p className="font-medium text-foreground text-sm">{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 w-full bg-input-bg dark:bg-input-bg">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div>
        <p className="text-foreground text-sm">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={title} />
    </div>
  )
}
