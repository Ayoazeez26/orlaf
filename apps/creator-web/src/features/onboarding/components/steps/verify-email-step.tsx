import { Button } from "@workspace/ui/components/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp"
import { Loader2, Mail } from "lucide-react"
import { useState } from "react"
import { resendVerification } from "@/features/auth/api/auth-api"
import { useAuth } from "@/features/auth/auth-context"
import { MfaVerifyDialog } from "@/features/auth/components/mfa-verify-dialog"
import { useOnboarding } from "../../onboarding-context"
import { OnboardingShell } from "../onboarding-shell"

interface VerifyEmailStepProps {
  progress: { currentIndex: number; total: number }
  onBack: () => void
}

export function VerifyEmailStep({ progress, onBack }: VerifyEmailStepProps) {
  const { data, dispatch } = useOnboarding()
  const { verifyEmailAndSignIn } = useAuth()
  const [code, setCode] = useState(data.verificationCode)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mfaToken, setMfaToken] = useState<string | null>(null)

  const emailHint = data.maskedEmail ?? data.profile.email ?? "your inbox"

  const handleVerify = async () => {
    if (code.length !== 6 || !data.verificationId) return

    setIsVerifying(true)
    setError(null)

    const result = await verifyEmailAndSignIn(data.verificationId, code, {
      inviteToken: data.inviteToken ?? undefined,
    })

    setIsVerifying(false)

    if (result.outcome === "success") {
      dispatch({ type: "SET_VERIFICATION_CODE", payload: code })
      return
    }

    if (result.outcome === "requires_2fa") {
      setMfaToken(result.mfaToken)
      return
    }

    if (result.outcome === "invalid_code") {
      setError(result.message)
      return
    }

    if (result.outcome === "code_expired") {
      setError(result.message)
      return
    }

    if (result.outcome === "too_many_attempts") {
      setError(result.message)
      return
    }

    setError(result.message)
  }

  const handleResend = async () => {
    if (!data.verificationId || isResending) return

    setIsResending(true)
    setError(null)

    const result = await resendVerification(data.verificationId)

    setIsResending(false)

    if (result.outcome === "success") {
      setResent(true)
      setTimeout(() => setResent(false), 3000)
      return
    }

    if (result.outcome === "cooldown") {
      setError(
        `${result.message} Try again in ${result.retryAfterSeconds} seconds.`
      )
      return
    }

    setError(result.message)
  }

  return (
    <>
      <OnboardingShell progress={progress} showBack onBack={onBack}>
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="size-7 text-primary" />
          </div>
          <h1 className="font-semibold text-2xl">Verify your email</h1>
          <p className="mt-2 max-w-sm text-muted-foreground text-sm">
            We sent a 6-digit code to {emailHint}. Enter it below.
          </p>
        </div>

        <div className="mt-8 flex justify-center overflow-x-auto px-1">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            containerClassName="gap-1 sm:gap-2"
          >
            <InputOTPGroup>
              {([0, 1, 2, 3, 4, 5] as const).map((index) => (
                <InputOTPSlot key={`otp-slot-${index}`} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <p className="mt-4 text-center text-destructive text-sm" role="alert">
            {error}
          </p>
        )}

        <Button
          type="button"
          className="mt-8 w-full text-base"
          disabled={code.length !== 6 || isVerifying || !data.verificationId}
          onClick={handleVerify}
        >
          {isVerifying ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Verifying…
            </>
          ) : (
            "Verify"
          )}
        </Button>

        <p className="mt-6 text-center text-muted-foreground text-sm">
          Didn&apos;t get the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="font-medium text-primary hover:underline disabled:opacity-50"
          >
            {isResending ? "Sending…" : resent ? "Code sent!" : "Resend"}
          </button>
        </p>
      </OnboardingShell>

      <MfaVerifyDialog
        open={mfaToken !== null}
        mfaToken={mfaToken ?? ""}
        onOpenChange={(open) => {
          if (!open) setMfaToken(null)
        }}
        onSuccess={() =>
          dispatch({ type: "SET_VERIFICATION_CODE", payload: code })
        }
        onError={setError}
      />
    </>
  )
}
