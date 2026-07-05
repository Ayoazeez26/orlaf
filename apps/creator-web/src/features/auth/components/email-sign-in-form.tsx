import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { PasswordInput } from "@/components/password-input"
import { useAuth } from "@/features/auth/auth-context"
import { MfaVerifyDialog } from "@/features/auth/components/mfa-verify-dialog"

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type SignInFormValues = z.infer<typeof signInSchema>

interface EmailSignInFormProps {
  onError?: (message: string) => void
  onUnverified?: (verificationId: string | null) => void
}

export function EmailSignInForm({
  onError,
  onUnverified,
}: EmailSignInFormProps) {
  const { signInWithEmail } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mfaToken, setMfaToken] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (values: SignInFormValues) => {
    setIsSubmitting(true)

    const result = await signInWithEmail({
      email: values.email,
      password: values.password,
    })

    setIsSubmitting(false)

    if (result.outcome === "success") {
      return
    }

    if (result.outcome === "requires_2fa") {
      setMfaToken(result.mfaToken)
      return
    }

    if (result.outcome === "email_not_verified") {
      onUnverified?.(result.verificationId)
      onError?.(result.message)
      return
    }

    if (result.outcome === "invalid_credentials") {
      onError?.(result.message)
      return
    }

    onError?.(result.message)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
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

        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <PasswordInput
            id="login-password"
            placeholder="Your password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-destructive text-xs">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="h-12 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Signing in…
            </>
          ) : (
            "Sign in with Email"
          )}
        </Button>
      </form>

      <MfaVerifyDialog
        open={mfaToken !== null}
        mfaToken={mfaToken ?? ""}
        onOpenChange={(open) => {
          if (!open) setMfaToken(null)
        }}
        onError={onError}
      />
    </>
  )
}
