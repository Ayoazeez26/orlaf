import { zodResolver } from "@hookform/resolvers/zod"
import {
  ClientOnly,
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AppLoadingScreen } from "@/components/app-loading-screen"
import { requestPasswordReset } from "@/features/auth/api/password-reset-api"
import { PasswordResetShell } from "@/features/auth/components/password-reset-shell"
import { writePasswordResetSession } from "@/features/auth/lib/password-reset-storage"

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export const Route = createFileRoute("/forgot-password/")({
  ssr: false,
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  return (
    <ClientOnly fallback={<ForgotPasswordFallback />}>
      <ForgotPasswordContent />
    </ClientOnly>
  )
}

function ForgotPasswordContent() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true)
    setError(null)

    const result = await requestPasswordReset(values.email)

    setIsSubmitting(false)

    if (result.outcome === "error") {
      setError(result.message)
      return
    }

    writePasswordResetSession({
      resetId: result.data.reset_id,
      maskedEmail: result.data.masked_email,
    })

    void navigate({
      to: "/forgot-password/verify",
      search: { reset_id: result.data.reset_id, sent: true },
    })
  }

  return (
    <PasswordResetShell
      title="Forgot password?"
      description="Enter your email and we'll send you a code to reset your password."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="forgot-email">Email</Label>
          <Input
            id="forgot-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email.message}</p>
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
              Sending code…
            </>
          ) : (
            "Send reset code"
          )}
        </Button>
      </form>
    </PasswordResetShell>
  )
}

function ForgotPasswordFallback() {
  return (
    <AppLoadingScreen
      mode="simulated"
      title="Loading"
      message="Preparing password reset…"
    />
  )
}
