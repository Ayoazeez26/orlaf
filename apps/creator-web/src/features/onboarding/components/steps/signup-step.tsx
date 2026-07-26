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
import { useOnboarding } from "../../onboarding-context"
import { OnboardingShell } from "../onboarding-shell"

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type SignupFormValues = z.infer<typeof signupSchema>

interface SignupStepProps {
  progress: { currentIndex: number; total: number }
  onBack: () => void
  onNext: () => void
}

export function SignupStep({ progress, onBack, onNext }: SignupStepProps) {
  const { data, dispatch } = useOnboarding()
  const { signUpWithEmail } = useAuth()
  const [apiError, setApiError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const emailLocked = Boolean(data.inviteToken)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: data.profile.firstName,
      lastName: data.profile.lastName,
      email: data.profile.email,
      password: data.profile.password,
    },
  })

  const onSubmit = async (values: SignupFormValues) => {
    setIsSubmitting(true)
    setApiError(null)

    dispatch({ type: "SET_PROFILE", payload: values })

    const result = await signUpWithEmail({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      surface: "creator-web",
      ...(data.inviteToken ? { invite_token: data.inviteToken } : {}),
    })

    setIsSubmitting(false)

    if (result.outcome === "success") {
      dispatch({
        type: "SET_VERIFICATION_META",
        payload: {
          verificationId: result.data.verification_id,
          maskedEmail: result.data.masked_email,
        },
      })
      onNext()
      return
    }

    if (result.outcome === "conflict") {
      if (result.provider) {
        setApiError(
          `This email is already registered with ${result.provider}. Try that sign-in method instead.`
        )
      } else {
        setApiError("This email is already registered. Please log in instead.")
      }
      return
    }

    setApiError(result.message)
  }

  return (
    <OnboardingShell
      progress={progress}
      showBack
      onBack={onBack}
      footer={
        <Button
          type="submit"
          form="signup-form"
          className="min-w-32"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Creating…
            </>
          ) : (
            "Get Started"
          )}
        </Button>
      }
    >
      <div>
        <h1 className="font-semibold text-2xl">Tell us about yourself</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Create your Sable Creator account
        </p>
      </div>

      <form
        id="signup-form"
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="Adekunle"
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
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Ciroma"
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            readOnly={emailLocked}
            aria-invalid={!!errors.email}
            className={emailLocked ? "bg-muted" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="Min. 6 characters"
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

        {apiError && (
          <p className="text-destructive text-sm" role="alert">
            {apiError}
          </p>
        )}
      </form>
    </OnboardingShell>
  )
}
