import {
  ClientOnly,
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp"
import { Loader2, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import { z } from "zod"
import { AppLoadingScreen } from "@/components/app-loading-screen"
import {
  resendPasswordResetOtp,
  verifyPasswordResetOtp,
} from "@/features/auth/api/password-reset-api"
import { PasswordResetShell } from "@/features/auth/components/password-reset-shell"
import { getAuthReady } from "@/features/auth/lib/auth-bootstrap"
import {
  readPasswordResetSession,
  updatePasswordResetSession,
  writePasswordResetSession,
} from "@/features/auth/lib/password-reset-storage"
import { resolvePostSignInRoute } from "@/features/auth/lib/post-sign-in-route"
import { toastApiError } from "@/lib/toast"

const verifySearchSchema = z.object({
  reset_id: z.string().optional(),
  sent: z.boolean().optional(),
})

export const Route = createFileRoute("/forgot-password/verify")({
  ssr: false,
  validateSearch: verifySearchSchema,
  beforeLoad: async ({ search }) => {
    const { status, session } = await getAuthReady()
    if (status === "loading" || status !== "authenticated" || !session) {
      const stored = readPasswordResetSession()
      const resetId = search.reset_id ?? stored?.resetId

      if (!resetId) {
        throw redirect({ to: "/forgot-password" })
      }

      if (!stored || stored.resetId !== resetId) {
        writePasswordResetSession({
          resetId,
          maskedEmail: stored?.maskedEmail ?? "your inbox",
        })
      }

      return
    }

    const destination = resolvePostSignInRoute(session)
    if (destination.to === "/onboarding" && destination.search?.step) {
      throw redirect({ to: destination.to, search: destination.search })
    }
    throw redirect({ to: destination.to })
  },
  component: ForgotPasswordVerifyPage,
})

function ForgotPasswordVerifyPage() {
  return (
    <ClientOnly fallback={<VerifyFallback />}>
      <ForgotPasswordVerifyContent />
    </ClientOnly>
  )
}

function ForgotPasswordVerifyContent() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const [code, setCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [sentNoticeVisible, setSentNoticeVisible] = useState(
    search.sent === true
  )

  const session = readPasswordResetSession()
  const resetId = search.reset_id ?? session?.resetId
  const emailHint = session?.maskedEmail ?? "your inbox"

  useEffect(() => {
    if (search.reset_id && session?.resetId !== search.reset_id) {
      writePasswordResetSession({
        resetId: search.reset_id,
        maskedEmail: session?.maskedEmail ?? "your inbox",
      })
    }
  }, [search.reset_id, session?.maskedEmail, session?.resetId])

  useEffect(() => {
    if (search.sent !== true) return

    setSentNoticeVisible(true)
    void navigate({
      to: "/forgot-password/verify",
      search: { reset_id: search.reset_id },
      replace: true,
    })
  }, [navigate, search.reset_id, search.sent])

  const handleVerify = async () => {
    if (code.length !== 6 || !resetId) return

    setIsVerifying(true)

    const result = await verifyPasswordResetOtp({ resetId, code })

    setIsVerifying(false)

    if (result.outcome === "success") {
      updatePasswordResetSession({ resetToken: result.data.reset_token })
      void navigate({ to: "/reset-password" })
      return
    }

    if (
      result.outcome === "invalid_code" ||
      result.outcome === "code_expired" ||
      result.outcome === "too_many_attempts"
    ) {
      toastApiError(result.message)
      return
    }

    toastApiError(result.message)
  }

  const handleResend = async () => {
    if (!resetId || isResending) return

    setIsResending(true)

    const result = await resendPasswordResetOtp(resetId)

    setIsResending(false)

    if (result.outcome === "success") {
      setResent(true)
      setSentNoticeVisible(true)
      setTimeout(() => setResent(false), 3000)
      return
    }

    if (result.outcome === "cooldown") {
      toastApiError(
        `${result.message} Try again in ${result.retryAfterSeconds} seconds.`
      )
      return
    }

    toastApiError(result.message)
  }

  return (
    <PasswordResetShell
      title="Check your email"
      description={`We sent a 6-digit code to ${emailHint}. Enter it below.`}
      footer={
        <p className="mt-6 text-center text-muted-foreground text-sm">
          Wrong email?{" "}
          <Link to="/forgot-password" className="text-primary hover:underline">
            Start over
          </Link>
        </p>
      }
    >
      {sentNoticeVisible && (
        <p
          className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-emerald-900 text-sm dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100"
          role="status"
        >
          Reset code sent to {emailHint}.
        </p>
      )}

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
              <InputOTPSlot key={`reset-otp-slot-${index}`} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button
        type="button"
        className="mt-8 w-full text-base"
        disabled={code.length !== 6 || isVerifying || !resetId}
        onClick={() => void handleVerify()}
      >
        {isVerifying ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Verifying…
          </>
        ) : (
          "Continue"
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
  )
}

function VerifyFallback() {
  return (
    <AppLoadingScreen
      mode="simulated"
      title="Loading"
      message="Preparing verification…"
    />
  )
}
