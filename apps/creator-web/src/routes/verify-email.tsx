import { ClientOnly, createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp"
import { Loader2, Mail } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { AppLoadingScreen } from "@/components/app-loading-screen"
import { resendVerification } from "@/features/auth/api/auth-api"
import { useAuth } from "@/features/auth/auth-context"
import { MfaVerifyDialog } from "@/features/auth/components/mfa-verify-dialog"
import { PasswordResetShell } from "@/features/auth/components/password-reset-shell"

function asSearchString(value: unknown): string | undefined {
  if (value == null || value === "") return undefined
  const normalized = String(value).replace(/^["']+|["']+$/g, "").trim()
  return normalized || undefined
}

function asOtpCode(value: unknown): string | undefined {
  const digits = asSearchString(value)?.replace(/\D/g, "").slice(0, 6)
  return digits || undefined
}

export const Route = createFileRoute("/verify-email")({
  ssr: false,
  // Public email-link page. Do not auth-redirect here — that loops with
  // SSR/search serialization (OTP codes bounce between 100602 and "100602").
  validateSearch: (search: Record<string, unknown>) => ({
    vid: asSearchString(search.vid),
    code: asOtpCode(search.code),
  }),
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  return (
    <ClientOnly fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </ClientOnly>
  )
}

function VerifyEmailContent() {
  const search = Route.useSearch()
  const { verifyEmailAndSignIn } = useAuth()
  const verificationId = search.vid ?? ""
  const initialCodeRef = useRef(search.code ?? "")
  const [code, setCode] = useState(initialCodeRef.current)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isAutoVerifying, setIsAutoVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mfaToken, setMfaToken] = useState<string | null>(null)
  const autoVerifyAttempted = useRef(false)

  const runVerify = useCallback(
    async (verificationCode: string) => {
      if (verificationCode.length !== 6 || !verificationId) return

      setIsVerifying(true)
      setError(null)

      const result = await verifyEmailAndSignIn(
        verificationId,
        verificationCode
      )

      setIsVerifying(false)
      setIsAutoVerifying(false)

      if (result.outcome === "success") {
        return
      }

      if (result.outcome === "requires_2fa") {
        setMfaToken(result.mfaToken)
        return
      }

      if (
        result.outcome === "invalid_code" ||
        result.outcome === "code_expired" ||
        result.outcome === "too_many_attempts"
      ) {
        setError(result.message)
        return
      }

      setError(result.message)
    },
    [verificationId, verifyEmailAndSignIn]
  )

  useEffect(() => {
    const initialCode = initialCodeRef.current
    if (
      autoVerifyAttempted.current ||
      !verificationId ||
      initialCode.length !== 6
    ) {
      return
    }

    autoVerifyAttempted.current = true
    setIsAutoVerifying(true)
    void runVerify(initialCode)
  }, [verificationId, runVerify])

  const handleVerify = () => {
    void runVerify(code)
  }

  const handleResend = async () => {
    if (!verificationId || isResending) return

    setIsResending(true)
    setError(null)

    const result = await resendVerification(verificationId)

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

  if (isAutoVerifying) {
    return (
      <AppLoadingScreen
        mode="simulated"
        title="Verifying your email"
        message="Confirming your verification code…"
      />
    )
  }

  return (
    <>
      <PasswordResetShell
        title="Verify your email"
        description="Enter the 6-digit code from your email to finish setting up your account."
        footer={
          <p className="mt-6 text-center text-muted-foreground text-sm">
            Wrong account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Back to sign in
            </Link>
          </p>
        }
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="size-7 text-primary" />
          </div>
        </div>

        <div className="flex justify-center overflow-x-auto px-1">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            containerClassName="gap-1 sm:gap-2"
          >
            <InputOTPGroup>
              {([0, 1, 2, 3, 4, 5] as const).map((index) => (
                <InputOTPSlot key={`verify-email-otp-${index}`} index={index} />
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
          disabled={code.length !== 6 || isVerifying || !verificationId}
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
            onClick={() => void handleResend()}
            disabled={isResending}
            className="font-medium text-primary hover:underline disabled:opacity-50"
          >
            {isResending ? "Sending…" : resent ? "Code sent!" : "Resend"}
          </button>
        </p>
      </PasswordResetShell>

      <MfaVerifyDialog
        open={mfaToken !== null}
        mfaToken={mfaToken ?? ""}
        onOpenChange={(open) => {
          if (!open) setMfaToken(null)
        }}
      />
    </>
  )
}

function VerifyEmailFallback() {
  return (
    <AppLoadingScreen
      mode="simulated"
      title="Loading"
      message="Preparing verification…"
    />
  )
}
