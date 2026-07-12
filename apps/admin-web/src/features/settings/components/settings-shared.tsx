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
  "aria-label": ariaLabel,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  "aria-label"?: string
}) {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={ariaLabel}
    />
  )
}

export function ToggleField({
  label,
  hint,
  checked,
  onCheckedChange,
}: {
  label: string
  hint?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <SettingsField label={label} hint={hint}>
      <div className="flex justify-end">
        <SwitchField checked={checked} onCheckedChange={onCheckedChange} />
      </div>
    </SettingsField>
  )
}

export function SettingsSection({
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
