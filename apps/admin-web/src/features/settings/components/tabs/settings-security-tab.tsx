import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Loader2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast, toastMutationError } from "@/lib/toast"
import {
  useSecuritySettingsQuery,
  useUpdateSecuritySettings,
} from "../../api/security-settings-hooks"
import {
  AUDIT_RETENTION_OPTIONS,
  SESSION_TIMEOUT_OPTIONS,
} from "../../constants"
import { registerSettingsSave } from "../../lib/settings-form-actions"
import {
  SettingsDivider,
  SettingsField,
  SettingsPanel,
  SettingsSection,
  ToggleField,
} from "../settings-shared"

const SESSION_TIMEOUT_MINUTES: Record<
  (typeof SESSION_TIMEOUT_OPTIONS)[number],
  number
> = {
  "30 minutes": 30,
  "1 hour": 60,
  "4 hours": 240,
  "8 hours": 480,
}

const AUDIT_RETENTION_DAYS: Record<
  (typeof AUDIT_RETENTION_OPTIONS)[number],
  number
> = {
  "30 days": 30,
  "60 days": 60,
  "90 days": 90,
  "1 year": 365,
}

function closestOption<T extends string>(
  map: Record<T, number>,
  value: number
): T {
  const entries = Object.entries(map) as [T, number][]
  return entries.reduce((closest, entry) =>
    Math.abs(entry[1] - value) < Math.abs(closest[1] - value) ? entry : closest
  )[0]
}

export function SettingsSecurityTab() {
  const { data, isLoading } = useSecuritySettingsQuery()
  const updateSettings = useUpdateSecuritySettings()

  const [require2fa, setRequire2fa] = useState(false)
  const [sessionTimeout, setSessionTimeout] =
    useState<(typeof SESSION_TIMEOUT_OPTIONS)[number]>("1 hour")
  const [allowedIps, setAllowedIps] = useState("")
  const [auditRetention, setAuditRetention] =
    useState<(typeof AUDIT_RETENTION_OPTIONS)[number]>("90 days")
  const [maskPii, setMaskPii] = useState(true)

  useEffect(() => {
    if (!data) return
    setRequire2fa(data.requireAdmin2fa)
    setSessionTimeout(
      closestOption(SESSION_TIMEOUT_MINUTES, data.sessionTimeoutMinutes)
    )
    setAllowedIps(data.allowedIpRanges)
    setAuditRetention(
      closestOption(AUDIT_RETENTION_DAYS, data.auditLogRetentionDays)
    )
    setMaskPii(data.maskPiiInReports)
  }, [data])

  const handleSave = useCallback(() => {
    updateSettings.mutate(
      {
        requireAdmin2fa: require2fa,
        sessionTimeoutMinutes: SESSION_TIMEOUT_MINUTES[sessionTimeout],
        allowedIpRanges: allowedIps,
        auditLogRetentionDays: AUDIT_RETENTION_DAYS[auditRetention],
        maskPiiInReports: maskPii,
      },
      {
        onSuccess: () => toast.success("Security settings saved"),
        onError: (error) =>
          toastMutationError(error, "Unable to save security settings"),
      }
    )
  }, [
    require2fa,
    sessionTimeout,
    allowedIps,
    auditRetention,
    maskPii,
    updateSettings,
  ])

  useEffect(() => registerSettingsSave(handleSave), [handleSave])

  return (
    <SettingsPanel>
      <SettingsSection
        title="Admin access"
        subtitle="How admins sign in to Sable TV."
      >
        <ToggleField
          label="Require 2FA for all admins"
          hint="Admins without an authenticator are forced to set one up on next sign-in; enrolled admins must enter a code every sign-in."
          checked={require2fa}
          onCheckedChange={setRequire2fa}
        />
        <ToggleField
          label="Single sign-on (SSO)"
          hint="Not available yet."
          checked={false}
          onCheckedChange={() => {}}
          disabled
        />
        <SettingsField
          label="Session timeout"
          hint="Display-only — not yet enforced against active sessions."
        >
          <Select
            value={sessionTimeout}
            onValueChange={(value) =>
              setSessionTimeout(
                value as (typeof SESSION_TIMEOUT_OPTIONS)[number]
              )
            }
          >
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
          hint="Informational only. Comma-separated CIDR blocks."
        >
          <Input
            value={allowedIps}
            onChange={(event) => setAllowedIps(event.target.value)}
            placeholder="e.g. 102.89.0.0/16, 196.32.0.0/12"
            disabled={isLoading}
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
          <Select
            value={auditRetention}
            onValueChange={(value) =>
              setAuditRetention(
                value as (typeof AUDIT_RETENTION_OPTIONS)[number]
              )
            }
          >
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
          hint="Applies to all reports and analytics exports."
          checked={maskPii}
          onCheckedChange={setMaskPii}
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
