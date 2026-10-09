import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Loader2, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/features/auth/auth-context"

interface AdminMfaVerifyDialogProps {
  open: boolean
  mfaToken: string
  onOpenChange: (open: boolean) => void
  onError?: (message: string) => void
}

export function AdminMfaVerifyDialog({
  open,
  mfaToken,
  onOpenChange,
  onError,
}: AdminMfaVerifyDialogProps) {
  const { verifyMfaAndSignIn } = useAuth()
  const [code, setCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!open) return null

  async function handleVerify() {
    setIsSubmitting(true)
    const result = await verifyMfaAndSignIn(mfaToken, code)
    setIsSubmitting(false)

    if (result.outcome === "success") {
      setCode("")
      onOpenChange(false)
      return
    }

    onError?.(result.message)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setCode("")
    onOpenChange(nextOpen)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close dialog"
        onClick={() => handleOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-mfa-title"
        className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="admin-mfa-title"
              className="font-semibold text-foreground text-lg"
            >
              Two-factor authentication
            </h2>
            <p className="mt-1 text-muted-foreground text-sm">
              Enter the 6-digit code from your authenticator app.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenChange(false)}
            aria-label="Close"
          >
            <X className="size-4" aria-hidden />
          </Button>
        </div>

        <div className="mt-5 space-y-2">
          <Label htmlFor="admin-mfa-code">Authenticator code</Label>
          <Input
            id="admin-mfa-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
            maxLength={6}
          />
        </div>

        <Button
          type="button"
          className="mt-5 w-full"
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
      </div>
    </div>
  )
}
