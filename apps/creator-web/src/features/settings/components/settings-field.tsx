import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import type { ReactNode } from "react"

interface SettingsFieldProps {
  label: string
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
  placeholder?: string
}

export function SettingsField({
  label,
  value,
  onChange,
  readOnly,
  prefix,
  suffix,
  placeholder,
}: SettingsFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="font-medium text-foreground text-sm">{label}</Label>
      <div className="relative flex items-center">
        {prefix ? (
          <span className="pointer-events-none absolute left-3 text-muted-foreground text-sm">
            {prefix}
          </span>
        ) : null}
        <Input
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`bg-input-bg ${prefix ? "pl-7" : ""} ${suffix ? "pr-24" : ""}`}
        />
        {suffix ? <div className="absolute right-1">{suffix}</div> : null}
      </div>
    </div>
  )
}
