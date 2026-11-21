import { zodResolver } from "@hookform/resolvers/zod"
import type { AdminInviteDetails } from "@sable/contracts"
import { ClientOnly, createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AppLoadingScreen } from "@/components/app-loading-screen"
import { PasswordInput } from "@/components/password-input"
import { PasswordStrengthBar } from "@/components/password-strength-bar"
import { getAdminInvite } from "@/features/auth/api/auth-api"
import { useAuth } from "@/features/auth/auth-context"
import { PasswordResetShell } from "@/features/auth/components/password-reset-shell"
import { TEAM_ROLE_LABEL } from "@/features/settings/constants"
import { passwordFieldSchema } from "@/lib/password-schema"
import { toast } from "@/lib/toast"

const acceptInviteSearchSchema = z.object({
  token: z.string().optional(),
})

const acceptInviteSchema = z
  .object({
    firstName: z.string().trim().min(1, "Enter your first name").max(80),
    lastName: z.string().trim().min(1, "Enter your last name").max(80),
    password: passwordFieldSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type AcceptInviteFormValues = z.infer<typeof acceptInviteSchema>

type InviteState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "error"; message: string }
  | { kind: "loaded"; invite: AdminInviteDetails }

export const Route = createFileRoute("/accept-invite")({
  ssr: false,
  validateSearch: acceptInviteSearchSchema,
  component: AcceptInvitePage,
})

function AcceptInvitePage() {
  return (
    <ClientOnly fallback={<AcceptInviteFallback />}>
      <AcceptInviteContent />
    </ClientOnly>
  )
}

function AcceptInviteContent() {
  const { token } = Route.useSearch()
  const { session, signOut } = useAuth()
  const [state, setState] = useState<InviteState>({ kind: "loading" })

  useEffect(() => {
    if (!token) {
      setState({ kind: "missing" })
      return
    }

    let active = true
    getAdminInvite(token).then((result) => {
      if (!active) return
      if (result.outcome === "found") {
        setState({ kind: "loaded", invite: result.data })
      } else if (result.outcome === "not_found") {
        setState({ kind: "missing" })
      } else {
        setState({ kind: "error", message: result.message })
      }
    })
    return () => {
      active = false
    }
  }, [token])

  if (state.kind === "loading") return <AcceptInviteFallback />

  if (state.kind === "missing") {
    return (
      <InviteNotice
        title="Invite not found"
        description="This invite link is invalid. Check that you copied the whole link, or ask a super admin to send a new invite."
      />
    )
  }

  if (state.kind === "error") {
    return (
      <InviteNotice title="Something went wrong" description={state.message} />
    )
  }

  const { invite } = state

  if (invite.status === "accepted") {
    return (
      <InviteNotice
        title="Invite already accepted"
        description="This invite has already been used. Sign in with the email and password you chose."
      />
    )
  }

  if (invite.status !== "valid") {
    return (
      <InviteNotice
        title={
          invite.status === "expired" ? "Invite expired" : "Invite revoked"
        }
        description={`This invite is no longer valid. Ask ${invite.invitedByName} or another super admin to send a new one.`}
      />
    )
  }

  if (session) {
    return (
      <PasswordResetShell
        title="You're already signed in"
        description={`You're signed in as ${session.admin.email}. Sign out to accept the invite for ${invite.email}.`}
      >
        <Button
          type="button"
          className="h-12 w-full"
          onClick={() => {
            // signOut navigates to /login; come back to this invite afterwards.
            const inviteUrl = window.location.href
            void signOut().then(() => {
              window.location.assign(inviteUrl)
            })
          }}
        >
          Sign out and continue
        </Button>
      </PasswordResetShell>
    )
  }

  return <AcceptInviteForm token={token as string} invite={invite} />
}

function AcceptInviteForm({
  token,
  invite,
}: {
  token: string
  invite: AdminInviteDetails
}) {
  const { acceptInvite } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AcceptInviteFormValues>({
    resolver: zodResolver(acceptInviteSchema),
  })

  const passwordValue = watch("password")
  const roleLabel = TEAM_ROLE_LABEL[invite.role] ?? "Admin"

  const onSubmit = async (values: AcceptInviteFormValues) => {
    setIsSubmitting(true)
    const result = await acceptInvite(token, {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      password: values.password,
    })
    // On success the auth context navigates into the workspace (or 2FA setup).
    if (result.outcome === "error") {
      setIsSubmitting(false)
      toast.error(result.message)
    }
  }

  return (
    <PasswordResetShell
      title="Join the admin team"
      description={`${invite.invitedByName} invited ${invite.email} as ${roleLabel}. Set up your account to continue.`}
      footer={
        <p className="mt-6 text-center text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="invite-first-name">First name</Label>
            <Input
              id="invite-first-name"
              autoComplete="given-name"
              aria-invalid={!!errors.firstName}
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-destructive text-xs">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-last-name">Last name</Label>
            <Input
              id="invite-last-name"
              autoComplete="family-name"
              aria-invalid={!!errors.lastName}
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-destructive text-xs">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="invite-email">Email</Label>
          <Input id="invite-email" value={invite.email} readOnly disabled />
        </div>

        <div className="space-y-2">
          <Label htmlFor="invite-password">Password</Label>
          <PasswordInput
            id="invite-password"
            placeholder="Min. 8 characters with upper, lower & symbol"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <PasswordStrengthBar password={passwordValue} />
          {errors.password && (
            <p className="text-destructive text-xs">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="invite-password-confirm">Confirm password</Label>
          <PasswordInput
            id="invite-password-confirm"
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

        <Button type="submit" className="h-12 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Creating your account…
            </>
          ) : (
            "Accept invite"
          )}
        </Button>
      </form>
    </PasswordResetShell>
  )
}

function InviteNotice({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <PasswordResetShell
      title={title}
      description={description}
      footer={
        <p className="mt-6 text-center text-muted-foreground text-sm">
          <Link to="/login" className="text-primary hover:underline">
            Go to sign in
          </Link>
        </p>
      }
    >
      {null}
    </PasswordResetShell>
  )
}

function AcceptInviteFallback() {
  return (
    <AppLoadingScreen
      subtitle="Admin"
      title="Loading"
      message="Opening your invite…"
    />
  )
}
