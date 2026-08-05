import { zodResolver } from "@hookform/resolvers/zod"
import {
  ClientOnly,
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AppLoadingScreen } from "@/components/app-loading-screen"
import { PasswordInput } from "@/components/password-input"
import { confirmPasswordReset } from "@/features/auth/api/password-reset-api"
import { PasswordResetShell } from "@/features/auth/components/password-reset-shell"
import { ResetPasswordMfaDialog } from "@/features/auth/components/reset-password-mfa-dialog"
import { getAuthReady } from "@/features/auth/lib/auth-bootstrap"
import {
  clearPasswordResetSession,
  readPasswordResetSession,
} from "@/features/auth/lib/password-reset-storage"
import { resolvePostSignInRoute } from "@/features/auth/lib/post-sign-in-route"

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  beforeLoad: async () => {
    const { status, session } = await getAuthReady()
    if (status === "loading" || status !== "authenticated" || !session) {
      const stored = readPasswordResetSession()
      if (!stored?.resetToken) {
        throw redirect({ to: "/forgot-password" })
      }
      return
    }

    const destination = resolvePostSignInRoute(session)
    if (destination.to === "/onboarding" && destination.search?.step) {
      throw redirect({ to: destination.to, search: destination.search })
    }
    throw redirect({ to: destination.to })
  },
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  return (
    <ClientOnly fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </ClientOnly>
  )
}

function ResetPasswordContent() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mfaToken, setMfaToken] = useState<string | null>(null)

  const resetToken = readPasswordResetSession()?.resetToken

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const finishReset = () => {
    clearPasswordResetSession()
    void navigate({ to: "/login", search: { reset: "success" } })
  }

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!resetToken) {
      setError("Your reset session expired. Please start again.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    const result = await confirmPasswordReset({
      resetToken,
      password: values.password,
    })

    setIsSubmitting(false)

    if (result.outcome === "success") {
      finishReset()
      return
    }

    if (result.outcome === "requires_2fa") {
      setMfaToken(result.mfaToken)
      return
    }

    setError(result.message)
  }

  return (
    <>
      <PasswordResetShell
        title="Choose a new password"
        description="Use at least 8 characters. You'll sign in with this password next time."
        footer={
          <p className="mt-6 text-center text-muted-foreground text-sm">
            Need a new code?{" "}
            <Link
              to="/forgot-password"
              className="text-primary hover:underline"
            >
              Start over
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-password">New password</Label>
            <PasswordInput
              id="reset-password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-destructive text-xs">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reset-password-confirm">Confirm password</Label>
            <PasswordInput
              id="reset-password-confirm"
              placeholder="Repeat your password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {error && (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="h-12 w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Updating password…
              </>
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
      </PasswordResetShell>

      <ResetPasswordMfaDialog
        open={mfaToken !== null}
        mfaToken={mfaToken ?? ""}
        onOpenChange={(open) => {
          if (!open) setMfaToken(null)
        }}
        onSuccess={finishReset}
        onError={setError}
      />
    </>
  )
}

function ResetPasswordFallback() {
  return (
    <AppLoadingScreen
      mode="simulated"
      title="Loading"
      message="Preparing password reset…"
    />
  )
}
