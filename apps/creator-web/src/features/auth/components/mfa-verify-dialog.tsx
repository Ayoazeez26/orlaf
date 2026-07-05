import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { SettingsModalShell } from "@/features/settings/components/settings-modal-shell"
import { useAuth } from "../auth-context"

interface MfaVerifyDialogProps {
  open: boolean
  mfaToken: string
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  onError?: (message: string) => void
}

export function MfaVerifyDialog({
  open,
  mfaToken,
  onOpenChange,
  onSuccess,
  onError,
}: MfaVerifyDialogProps) {
  const { verifyMfaAndSignIn } = useAuth()
  const [code, setCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleVerify() {
    setIsSubmitting(true)
    const result = await verifyMfaAndSignIn(mfaToken, code)
    setIsSubmitting(false)

    if (result.outcome === "success") {
      setCode("")
      onOpenChange(false)
      onSuccess?.()
      return
    }

    if (result.outcome === "invalid_code") {
      onError?.(result.message)
      return
    }

    onError?.(result.message)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setCode("")
    }
    onOpenChange(nextOpen)
  }

  return (
    <SettingsModalShell
      open={open}
      onOpenChange={handleOpenChange}
      title="Two-factor authentication"
      description="Enter the 6-digit code from your authenticator app."
      footer={
        <Button
          type="button"
          onClick={() => void handleVerify()}
          disabled={code.length < 6 || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Verifying…
            </>
          ) : (
            "Continue"
          )}
        </Button>
      }
    >
      <div className="space-y-2">
        <Label htmlFor="mfa-code">Authenticator code</Label>
        <Input
          id="mfa-code"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
          maxLength={6}
        />
      </div>
    </SettingsModalShell>
  )
}
