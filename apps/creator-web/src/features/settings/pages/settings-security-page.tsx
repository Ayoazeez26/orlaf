import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  KeyRound,
  Laptop,
  Loader2,
  Lock,
  LogOut,
  Phone,
  Smartphone,
} from "lucide-react"
import { useState } from "react"
import { PasswordInput } from "@/components/password-input"
import { ApiError } from "@/lib/http-client"
import { SettingsModalShell } from "../components/settings-modal-shell"
import { SettingsPageSkeleton } from "../components/settings-page-skeleton"
import { SettingsSectionCard } from "../components/settings-section-card"
import {
  useActiveSessions,
  useChangePassword,
  useDisableTotp,
  useEnableTotp,
  useRevokeSession,
  useSecurityStatus,
  useSetPassword,
  useSetupTotp,
} from "../hooks/use-security"
import { formatSessionLastActive } from "../lib/format-session-time"

export function SettingsSecurityPage() {
  const { data: status, isLoading: statusLoading } = useSecurityStatus()
  const { data: sessionsData, isLoading: sessionsLoading } = useActiveSessions()
  const revokeSession = useRevokeSession()
  const setPasswordMutation = useSetPassword()
  const changePasswordMutation = useChangePassword()
  const setupTotp = useSetupTotp()
  const enableTotp = useEnableTotp()
  const disableTotp = useDisableTotp()

  const [passwordOpen, setPasswordOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [totpOpen, setTotpOpen] = useState(false)
  const [totpSecret, setTotpSecret] = useState<string | null>(null)
  const [totpUrl, setTotpUrl] = useState<string | null>(null)
  const [totpCode, setTotpCode] = useState("")
  const [disableOpen, setDisableOpen] = useState(false)
  const [disableCode, setDisableCode] = useState("")

  if (statusLoading || sessionsLoading) {
    return <SettingsPageSkeleton />
  }

  if (!status) return null

  async function handleSetPassword() {
    await setPasswordMutation.mutateAsync({ password })
    setPasswordOpen(false)
    setPassword("")
  }

  function resetChangePasswordForm() {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setPasswordError(null)
  }

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.")
      return
    }

    setPasswordError(null)

    try {
      await changePasswordMutation.mutateAsync({
        current_password: currentPassword,
        new_password: newPassword,
      })
      setChangePasswordOpen(false)
      resetChangePasswordForm()
    } catch (error) {
      if (error instanceof ApiError) {
        setPasswordError(error.message)
        return
      }
      setPasswordError("Unable to change password. Please try again.")
    }
  }

  const canSubmitChangePassword =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    confirmPassword.length >= 8 &&
    newPassword === confirmPassword

  async function handleStartTotp() {
    const result = await setupTotp.mutateAsync()
    setTotpSecret(result.secret)
    setTotpUrl(result.otpauthUrl)
    setTotpOpen(true)
  }

  async function handleEnableTotp() {
    await enableTotp.mutateAsync({ code: totpCode })
    setTotpOpen(false)
    setTotpCode("")
    setTotpSecret(null)
    setTotpUrl(null)
  }

  async function handleDisableTotp() {
    await disableTotp.mutateAsync({ code: disableCode })
    setDisableOpen(false)
    setDisableCode("")
  }

  return (
    <div className="space-y-6">
      <SettingsSectionCard title="Password">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Lock className="size-4 text-primary" aria-hidden />
            </span>
            <div>
              <p className="font-medium text-foreground text-sm">Password</p>
              <p className="text-muted-foreground text-sm">
                {status.has_password
                  ? "Password is set for your account."
                  : "Set a password so you can also sign in with email."}
              </p>
            </div>
          </div>
          {status.can_set_password ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-lg"
              onClick={() => setPasswordOpen(true)}
            >
              Set password
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="rounded-lg"
              onClick={() => setChangePasswordOpen(true)}
            >
              Change password
            </Button>
          )}
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account."
      >
        <div className="space-y-3">
          <SecurityMethodRow
            icon={KeyRound}
            label="Authenticator App"
            description="Use Google Authenticator or Authy"
            enabled={status.totp_enabled}
            actionLabel={status.totp_enabled ? "Disable" : "Enable"}
            onAction={
              status.totp_enabled
                ? () => setDisableOpen(true)
                : () => void handleStartTotp()
            }
            loading={setupTotp.isPending}
          />
          <SecurityMethodRow
            icon={Phone}
            label="SMS Verification"
            description="Coming soon — receive codes via text message"
            disabled
            actionLabel="Enable"
          />
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard
        title="Active sessions"
        description="Devices currently signed in to your studio."
      >
        <div className="space-y-3">
          {sessionsData?.sessions.length ? (
            sessionsData.sessions.map((session) => {
              const DeviceIcon = session.device.includes("iPhone")
                ? Smartphone
                : Laptop
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between gap-4 border-border border-b py-3 last:border-b-0"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <DeviceIcon
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-foreground text-sm">
                          {session.device} · {session.location}
                        </p>
                        {session.current ? (
                          <Badge className="border-transparent bg-muted text-muted-foreground text-xs">
                            Current
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {session.browser} ·{" "}
                        {formatSessionLastActive(session.lastActiveAt)}
                      </p>
                    </div>
                  </div>
                  {!session.current ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-muted-foreground"
                      disabled={revokeSession.isPending}
                      onClick={() => revokeSession.mutate(session.id)}
                    >
                      {revokeSession.isPending ? (
                        <Loader2
                          className="size-3.5 animate-spin"
                          aria-hidden
                        />
                      ) : (
                        <LogOut className="size-3.5" aria-hidden />
                      )}
                      Sign out
                    </Button>
                  ) : null}
                </div>
              )
            })
          ) : (
            <p className="text-muted-foreground text-sm">No active sessions.</p>
          )}
        </div>
      </SettingsSectionCard>

      <SettingsModalShell
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        title="Set password"
        description="Choose a password with at least 8 characters."
        footer={
          <Button
            type="button"
            onClick={() => void handleSetPassword()}
            disabled={password.length < 8 || setPasswordMutation.isPending}
          >
            Save password
          </Button>
        }
      >
        <div className="space-y-2">
          <Label htmlFor="new-password">Password</Label>
          <Input
            id="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </SettingsModalShell>

      <SettingsModalShell
        open={changePasswordOpen}
        onOpenChange={(open) => {
          setChangePasswordOpen(open)
          if (!open) resetChangePasswordForm()
        }}
        title="Change password"
        description="Enter your current password, then choose a new one with at least 8 characters."
        footer={
          <Button
            type="button"
            onClick={() => void handleChangePassword()}
            disabled={
              !canSubmitChangePassword || changePasswordMutation.isPending
            }
          >
            {changePasswordMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              "Save password"
            )}
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current password</Label>
            <PasswordInput
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="change-new-password">New password</Label>
            <PasswordInput
              id="change-new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">Confirm new password</Label>
            <PasswordInput
              id="confirm-new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {passwordError ? (
            <p className="text-destructive text-sm" role="alert">
              {passwordError}
            </p>
          ) : null}
        </div>
      </SettingsModalShell>

      <SettingsModalShell
        open={totpOpen}
        onOpenChange={setTotpOpen}
        title="Enable authenticator app"
        description="Add this account to your authenticator app, then enter the 6-digit code."
        footer={
          <Button
            type="button"
            onClick={() => void handleEnableTotp()}
            disabled={totpCode.length < 6 || enableTotp.isPending}
          >
            Confirm
          </Button>
        }
      >
        {totpSecret ? (
          <div className="space-y-3">
            <p className="break-all font-mono text-sm">{totpSecret}</p>
            {totpUrl ? (
              <a
                href={totpUrl}
                className="text-primary text-sm underline"
                target="_blank"
                rel="noreferrer"
              >
                Open in authenticator app
              </a>
            ) : null}
            <Input
              placeholder="123456"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
            />
          </div>
        ) : null}
      </SettingsModalShell>

      <SettingsModalShell
        open={disableOpen}
        onOpenChange={setDisableOpen}
        title="Disable authenticator app"
        description="Enter a current code from your authenticator app to disable 2FA."
        footer={
          <Button
            type="button"
            variant="destructive"
            onClick={() => void handleDisableTotp()}
            disabled={disableCode.length < 6 || disableTotp.isPending}
          >
            Disable 2FA
          </Button>
        }
      >
        <Input
          placeholder="123456"
          value={disableCode}
          onChange={(e) => setDisableCode(e.target.value)}
        />
      </SettingsModalShell>
    </div>
  )
}

function SecurityMethodRow({
  icon: Icon,
  label,
  description,
  enabled: _enabled,
  disabled,
  actionLabel,
  onAction,
  loading,
}: {
  icon: typeof KeyRound
  label: string
  description: string
  enabled?: boolean
  disabled?: boolean
  actionLabel: string
  onAction?: () => void
  loading?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-4 text-primary" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="font-medium text-foreground text-sm">{label}</p>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-lg"
        disabled={disabled || loading}
        onClick={onAction}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          actionLabel
        )}
      </Button>
    </div>
  )
}
