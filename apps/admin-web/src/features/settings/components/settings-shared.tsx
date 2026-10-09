import { Card, CardContent } from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"

interface SettingsFieldProps {
  label: string
  hint?: string
  children: React.ReactNode
  className?: string
}

export function SettingsField({
  label,
  hint,
  children,
  className,
}: SettingsFieldProps) {
  return (
    <div
      className={cn(
        "grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,240px)] sm:items-center sm:gap-6",
        className
      )}
    >
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

export function SwitchField({
  checked,
  onCheckedChange,
  disabled,
  "aria-label": ariaLabel,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  "aria-label"?: string
}) {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-label={ariaLabel}
    />
  )
}

export function ToggleField({
  label,
  hint,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: string
  hint?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <SettingsField label={label} hint={hint}>
      <div className="flex justify-end">
        <SwitchField
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      </div>
    </SettingsField>
  )
}

export function SettingsSection({
  title,
  subtitle,
  comingSoon = false,
  children,
}: {
  title: string
  subtitle: string
  /** Shows a badge and disables the controls until the setting is wired up. */
  comingSoon?: boolean
  children: React.ReactNode
}) {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="flex items-center gap-2 font-semibold text-base text-foreground tracking-tight">
          {title}
          {comingSoon ? (
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 font-medium text-[11px] text-muted-foreground tracking-normal">
              Coming soon
            </span>
          ) : null}
        </h3>
        <p className="mt-0.5 text-muted-foreground text-sm">{subtitle}</p>
      </div>
      {comingSoon ? (
        <fieldset disabled className="space-y-5 opacity-60">
          {children}
        </fieldset>
      ) : (
        <div className="space-y-5">{children}</div>
      )}
    </section>
  )
}

export function SettingsPanel({ children }: { children: React.ReactNode }) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="space-y-8 px-4 sm:px-6">{children}</CardContent>
    </Card>
  )
}

export function SettingsDivider() {
  return <div className="border-border border-t" />
}
