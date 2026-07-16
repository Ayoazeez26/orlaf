import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { PasswordInput } from "@/components/password-input"
import { useAuth } from "@/features/auth/auth-context"

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type SignInFormValues = z.infer<typeof signInSchema>

interface AdminSignInFormProps {
  onError: (message: string | null) => void
}

export function AdminSignInForm({ onError }: AdminSignInFormProps) {
  const { signInWithEmail } = useAuth()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    onError(null)
    setSubmitting(true)

    try {
      const result = await signInWithEmail(values)

      if (result.outcome === "invalid_credentials") {
        onError(result.message)
        return
      }

      if (result.outcome === "error") {
        onError(result.message)
      }
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="admin-email">Email</Label>
        <Input
          id="admin-email"
          type="email"
          autoComplete="email"
          disabled={submitting}
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-destructive text-sm">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-password">Password</Label>
        <PasswordInput
          id="admin-password"
          autoComplete="current-password"
          disabled={submitting}
          {...form.register("password")}
        />
        {form.formState.errors.password ? (
          <p className="text-destructive text-sm">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  )
}
