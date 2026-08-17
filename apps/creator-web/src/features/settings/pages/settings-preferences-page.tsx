import type { ColorScheme } from "@sable/contracts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Switch } from "@workspace/ui/components/switch"
import { cn } from "@workspace/ui/lib/utils"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import { toast, toastMutationError } from "@/lib/toast"
import { SettingsPageSkeleton } from "../components/settings-page-skeleton"
import { SettingsSectionCard } from "../components/settings-section-card"
import { applyDisplayPreferences } from "../hooks/use-apply-creator-preferences"
import { usePreferences, useUpdatePreferences } from "../hooks/use-preferences"
import {
  formToPreferencesPatch,
  LANGUAGE_SELECT_OPTIONS,
  type PreferencesFormState,
  preferencesToForm,
  TIMEZONE_SELECT_OPTIONS,
  timezoneLabel,
  timezoneValue,
  VISIBILITY_SELECT_OPTIONS,
  visibilityLabel,
  visibilityValue,
} from "../lib/map-preferences"
import {
  registerSettingsReset,
  registerSettingsSave,
} from "../lib/settings-form-actions"

const COLOR_SCHEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const

export function SettingsPreferencesPage() {
  const { data, isLoading, isError } = usePreferences()
  const updatePreferences = useUpdatePreferences()
  const { setTheme } = useTheme()
  const setThemeRef = useRef(setTheme)
  setThemeRef.current = setTheme
  const [mounted, setMounted] = useState(false)
  const initialFormRef = useRef<PreferencesFormState | null>(null)
  const savedPreferencesRef = useRef(data)
  savedPreferencesRef.current = data
  const [form, setForm] = useState<PreferencesFormState | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!data) return
    const initial = preferencesToForm(data)
    initialFormRef.current = initial
    setForm(initial)
  }, [data])

  // Sync to saved display prefs when opening the page or after a successful save.
  useEffect(() => {
    if (!data) return
    applyDisplayPreferences(data, (theme) => setThemeRef.current(theme))
  }, [data])

  // Revert unsaved display previews when leaving the page.
  useEffect(() => {
    return () => {
      const saved = savedPreferencesRef.current
      if (!saved) return
      applyDisplayPreferences(saved, (theme) => setThemeRef.current(theme))
    }
  }, [])

  useEffect(() => {
    if (!form) return

    function handleSave() {
      updatePreferences.mutate(formToPreferencesPatch(form), {
        onSuccess: (saved) => {
          const next = preferencesToForm(saved)
          initialFormRef.current = next
          setForm(next)
          applyDisplayPreferences(saved, setTheme)
          toast.success("Preferences saved.")
        },
        onError: (error) => {
          toastMutationError(error, "Failed to save preferences")
        },
      })
    }

    function handleReset() {
      const initial = initialFormRef.current
      if (!initial) return
      setForm(initial)
      applyDisplayPreferences(initial, setTheme)
    }

    const unregisterSave = registerSettingsSave(handleSave)
    const unregisterReset = registerSettingsReset(handleReset)
    return () => {
      unregisterSave()
      unregisterReset()
    }
  }, [form, setTheme, updatePreferences])

  if (isLoading || !form) {
    return <SettingsPageSkeleton />
  }

  if (isError) {
    return (
      <p className="text-destructive text-sm">
        Could not load preferences. Please try again.
      </p>
    )
  }

  function updateForm(patch: Partial<PreferencesFormState>) {
    if (patch.reducedMotion !== undefined && typeof document !== "undefined") {
      document.documentElement.toggleAttribute(
        "data-reduced-motion",
        patch.reducedMotion
      )
    }
    setForm((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  return (
    <div className="space-y-6">
      <SettingsSectionCard
        title="Content Defaults"
        description="Default settings for new series and episodes."
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Default language"
              value={form.defaultLanguage}
              onChange={(value) => updateForm({ defaultLanguage: value })}
              options={LANGUAGE_SELECT_OPTIONS}
            />
            <SelectField
              label="Default visibility"
              value={visibilityLabel(form.defaultVisibility)}
              onChange={(value) =>
                updateForm({ defaultVisibility: visibilityValue(value) })
              }
              options={VISIBILITY_SELECT_OPTIONS}
            />
          </div>
          <ToggleRow
            title="Enable comments by default"
            description="Allow viewers to comment on new episodes"
            checked={form.commentsEnabledByDefault}
            onChange={(value) =>
              updateForm({ commentsEnabledByDefault: value })
            }
          />
          <ToggleRow
            title="Auto-publish after processing"
            description="Publish the series when you click Publish and all episodes are ready"
            checked={form.autoPublishAfterProcessing}
            onChange={(value) =>
              updateForm({ autoPublishAfterProcessing: value })
            }
          />
          <ToggleRow
            title="Enable tipping by default"
            description="Let viewers send tips on your content"
            checked={form.tippingEnabledByDefault}
            onChange={(value) => updateForm({ tippingEnabledByDefault: value })}
          />
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard
        title="Display & Accessibility"
        description="Customize your dashboard experience."
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Dashboard language"
              value={form.dashboardLanguage}
              onChange={(value) => updateForm({ dashboardLanguage: value })}
              options={LANGUAGE_SELECT_OPTIONS}
            />
            <SelectField
              label="Timezone"
              value={timezoneLabel(form.timezone)}
              onChange={(value) =>
                updateForm({ timezone: timezoneValue(value) })
              }
              options={TIMEZONE_SELECT_OPTIONS}
            />
          </div>

          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground text-sm">
                Color scheme
              </p>
              <p className="text-muted-foreground text-sm">
                System matches your device automatically.
              </p>
            </div>
            {mounted ? (
              <div className="inline-flex w-full max-w-md items-center gap-1 rounded-xl border border-border bg-muted/40 p-1 sm:w-auto">
                {COLOR_SCHEMES.map(({ value, label, icon: Icon }) => {
                  const active = form.colorScheme === value
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setTheme(value)
                        updateForm({ colorScheme: value as ColorScheme })
                      }}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 font-medium text-sm transition-colors sm:flex-none",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                      {label}
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>

          <ToggleRow
            title="Reduced motion"
            description="Minimize animations throughout the dashboard"
            checked={form.reducedMotion}
            onChange={(value) => updateForm({ reducedMotion: value })}
          />
        </div>
      </SettingsSectionCard>
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
        <SelectTrigger className="h-10 w-full">
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
        <p className="font-medium text-foreground text-sm">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={title} />
    </div>
  )
}
