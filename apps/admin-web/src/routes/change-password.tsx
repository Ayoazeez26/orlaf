import { zodResolver } from "@hookform/resolvers/zod"
import { ClientOnly, createFileRoute, redirect } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AppLoadingScreen } from "@/components/app-loading-screen"
import { PasswordInput } from "@/components/password-input"
import { SableBrandMark } from "@/components/sable-brand-mark"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { useAuth } from "@/features/auth/auth-context"
import { getAuthReady } from "@/features/auth/lib/auth-bootstrap"
import { resolvePostSignInRoute } from "@/features/auth/lib/post-sign-in-route"

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

export const Route = createFileRoute("/change-password")({
  ssr: false,
  beforeLoad: async () => {
    const { status, session } = await getAuthReady()

    if (status === "loading") return

    if (status !== "authenticated" || !session) {
      throw redirect({ to: "/login" })
    }

    if (!session.must_change_password) {
      const destination = resolvePostSignInRoute(session)
      if (destination.params) {
        throw redirect({ to: destination.to, params: destination.params })
      }
      throw redirect({ to: destination.to })
    }
  },
  component: ChangePasswordPage,
})

function ChangePasswordPage() {
  return (
    <ClientOnly fallback={<ChangePasswordFallback />}>
      <ChangePasswordContent />
    </ClientOnly>
  )
}

function ChangePasswordContent() {
  const { changePassword } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null)
    setSubmitting(true)

    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
    } catch {
      setFormError("Unable to change password. Check your current password.")
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background px-4 py-8">
      <div className="absolute top-4 right-4 left-4 z-10 flex justify-end sm:left-auto">
        <ThemeSwitcher compact />
      </div>
      <SableBrandMark className="mb-6" subtitle="Admin" />
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <h1 className="font-semibold text-xl sm:text-2xl">
            Set a new password
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Your account requires a password change before you can continue.
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="current-password">Current password</Label>
            <PasswordInput
              id="current-password"
              autoComplete="current-password"
              disabled={submitting}
              {...form.register("currentPassword")}
            />
            {form.formState.errors.currentPassword ? (
              <p className="text-destructive text-sm">
                {form.formState.errors.currentPassword.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <PasswordInput
              id="new-password"
              autoComplete="new-password"
              disabled={submitting}
              {...form.register("newPassword")}
            />
            {form.formState.errors.newPassword ? (
              <p className="text-destructive text-sm">
                {form.formState.errors.newPassword.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <PasswordInput
              id="confirm-password"
              autoComplete="new-password"
              disabled={submitting}
              {...form.register("confirmPassword")}
            />
            {form.formState.errors.confirmPassword ? (
              <p className="text-destructive text-sm">
                {form.formState.errors.confirmPassword.message}
              </p>
            ) : null}
          </div>

          {formError ? (
            <p className="text-destructive text-sm" role="alert">
              {formError}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Updating…" : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  )
}

function ChangePasswordFallback() {
  return (
    <AppLoadingScreen
      title="Loading"
      message="Preparing password change…"
      subtitle="Admin"
    />
  )
}
