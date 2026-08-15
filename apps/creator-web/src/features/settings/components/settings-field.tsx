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
      <div className="flex h-10 items-center overflow-hidden rounded-md border border-input bg-input-bg">
        {prefix ? (
          <span className="shrink-0 pl-3 text-muted-foreground text-sm">
            {prefix}
          </span>
        ) : null}
        <Input
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          readOnly={readOnly}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
        {suffix ? <div className="shrink-0 pr-1">{suffix}</div> : null}
      </div>
    </div>
  )
}
