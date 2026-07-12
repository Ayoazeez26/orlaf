import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useState } from "react"
import {
  AUDIT_RETENTION_OPTIONS,
  SESSION_TIMEOUT_OPTIONS,
} from "../../constants"
import {
  SettingsDivider,
  SettingsField,
  SettingsPanel,
  SettingsSection,
  ToggleField,
} from "../settings-shared"

export function SettingsSecurityTab() {
  const [require2fa, setRequire2fa] = useState(true)
  const [ssoEnabled, setSsoEnabled] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState("1 hour")
  const [allowedIps, setAllowedIps] = useState("")
  const [auditRetention, setAuditRetention] = useState("90 days")
  const [maskPii, setMaskPii] = useState(true)

  return (
    <SettingsPanel>
      <SettingsSection
        title="Admin access"
        subtitle="How admins sign in to Sable TV."
      >
        <ToggleField
          label="Require 2FA for all admins"
          hint="Admins must enrol an authenticator app on next sign-in."
          checked={require2fa}
          onCheckedChange={setRequire2fa}
        />
        <ToggleField
          label="Single sign-on (SSO)"
          hint="Allow Google Workspace sign-in."
          checked={ssoEnabled}
          onCheckedChange={setSsoEnabled}
        />
        <SettingsField label="Session timeout">
          <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SESSION_TIMEOUT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField
          label="Allowed IP ranges"
          hint="Optional. Comma-separated CIDR blocks."
        >
          <Input
            value={allowedIps}
            onChange={(event) => setAllowedIps(event.target.value)}
            placeholder="e.g. 102.89.0.0/16, 196.32.0.0/12"
            className="h-9"
          />
        </SettingsField>
      </SettingsSection>

      <SettingsDivider />

      <SettingsSection
        title="Audit & data"
        subtitle="Visibility and retention."
      >
        <SettingsField label="Audit log retention">
          <Select value={auditRetention} onValueChange={setAuditRetention}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AUDIT_RETENTION_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>
        <ToggleField
          label="Mask viewer PII in reports"
          hint="Hide email and phone in analytics exports."
          checked={maskPii}
          onCheckedChange={setMaskPii}
        />
      </SettingsSection>
    </SettingsPanel>
  )
}
